// Use Cases - Application Layer (Clean Architecture)
// Single Responsibility Principle - Each use case handles one business operation
// Dependency Inversion Principle - Depends on abstractions, not concrete implementations

import { IUseCase, ILogger } from '../interfaces';
import { IUserRepository } from '../repositories/userRepository';
import { User, UserRole, UserStatus, UserProfile } from '../domain/user';
import { Email, Password, Username } from '../domain/base';

// Create User Use Case
export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateUserResponse {
  user: User;
  success: boolean;
  message: string;
}

export class CreateUserUseCase implements IUseCase<CreateUserRequest, CreateUserResponse> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      this.logger.info('Creating new user', { username: request.username, email: request.email });

      // Check if user already exists
      const existingUserByEmail = await this.userRepository.existsByEmail(request.email);
      if (existingUserByEmail) {
        return {
          user: null as any,
          success: false,
          message: 'User with this email already exists'
        };
      }

      const existingUserByUsername = await this.userRepository.existsByUsername(request.username);
      if (existingUserByUsername) {
        return {
          user: null as any,
          success: false,
          message: 'User with this username already exists'
        };
      }

      // Create user entity
      const user = await User.create(
        `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        request.username,
        request.email,
        request.password
      );

      // Update profile with additional information
      user.updateProfile({
        bio: `${request.firstName} ${request.lastName}`,
        preferences: {
          theme: 'light',
          notifications: { email: true, push: true },
          privacy: { showEmail: false, showFavorites: true }
        }
      });

      // Save user
      const savedUser = await this.userRepository.create(user);

      this.logger.info('User created successfully', { userId: savedUser.id });

      return {
        user: savedUser,
        success: true,
        message: 'User created successfully'
      };
    } catch (error) {
      this.logger.error('Failed to create user', error as Error, { request });
      return {
        user: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create user'
      };
    }
  }
}

// Authenticate User Use Case
export interface AuthenticateUserRequest {
  email: string;
  password: string;
}

export interface AuthenticateUserResponse {
  user: User | null;
  success: boolean;
  message: string;
  token?: string;
}

export class AuthenticateUserUseCase implements IUseCase<AuthenticateUserRequest, AuthenticateUserResponse> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  async execute(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    try {
      this.logger.info('Authenticating user', { email: request.email });

      // Find user by email
      const user = await this.userRepository.findByEmail(request.email);
      if (!user) {
        this.logger.warn('Authentication failed - user not found', { email: request.email });
        return {
          user: null,
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Check if user is active
      if (user.status !== UserStatus.ACTIVE) {
        this.logger.warn('Authentication failed - user not active', { 
          userId: user.id, 
          status: user.status 
        });
        return {
          user: null,
          success: false,
          message: 'Account is not active'
        };
      }

      // Check if user is locked
      if (user.isLocked) {
        this.logger.warn('Authentication failed - account locked', { userId: user.id });
        return {
          user: null,
          success: false,
          message: 'Account is locked. Please try again later.'
        };
      }

      // Verify password
      const isValidPassword = await user.verifyPassword(request.password);
      if (!isValidPassword) {
        // Record failed attempt
        user.recordLoginAttempt();
        await this.userRepository.save(user);

        this.logger.warn('Authentication failed - invalid password', { userId: user.id });
        return {
          user: null,
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Update last login and reset failed attempts
      user.recordSuccessfulLogin();
      await this.userRepository.save(user);

      this.logger.info('User authenticated successfully', { userId: user.id });

      return {
        user,
        success: true,
        message: 'Authentication successful'
        // token would be generated by JWT service in infrastructure layer
      };
    } catch (error) {
      this.logger.error('Failed to authenticate user', error as Error, { email: request.email });
      return {
        user: null,
        success: false,
        message: 'Authentication failed'
      };
    }
  }
}

// Get User Profile Use Case
export interface GetUserProfileRequest {
  userId: string;
}

export interface GetUserProfileResponse {
  user: User | null;
  success: boolean;
  message: string;
}

export class GetUserProfileUseCase implements IUseCase<GetUserProfileRequest, GetUserProfileResponse> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  async execute(request: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    try {
      this.logger.info('Getting user profile', { userId: request.userId });

      const user = await this.userRepository.findById(request.userId);
      
      if (!user) {
        return {
          user: null,
          success: false,
          message: 'User not found'
        };
      }

      return {
        user,
        success: true,
        message: 'User profile retrieved successfully'
      };
    } catch (error) {
      this.logger.error('Failed to get user profile', error as Error, { userId: request.userId });
      return {
        user: null,
        success: false,
        message: 'Failed to retrieve user profile'
      };
    }
  }
}

// Update User Profile Use Case
export interface UpdateUserProfileRequest {
  userId: string;
  bio?: string;
  profilePicture?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'auto';
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
    privacy?: {
      showEmail?: boolean;
      showFavorites?: boolean;
    };
  };
}

export interface UpdateUserProfileResponse {
  user: User | null;
  success: boolean;
  message: string;
}

export class UpdateUserProfileUseCase implements IUseCase<UpdateUserProfileRequest, UpdateUserProfileResponse> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  async execute(request: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
    try {
      this.logger.info('Updating user profile', { userId: request.userId });

      const user = await this.userRepository.findById(request.userId);
      
      if (!user) {
        return {
          user: null,
          success: false,
          message: 'User not found'
        };
      }

      // Create updated profile
      const currentProfile = user.profile;
      const updatedProfile: Partial<UserProfile> = {};

      if (request.bio !== undefined) {
        updatedProfile.bio = request.bio;
      }

      if (request.profilePicture !== undefined) {
        updatedProfile.profilePicture = request.profilePicture;
      }

      if (request.preferences) {
        const currentPrefs = currentProfile.preferences;
        updatedProfile.preferences = {
          theme: request.preferences.theme || currentPrefs.theme,
          notifications: {
            email: request.preferences.notifications?.email ?? currentPrefs.notifications.email,
            push: request.preferences.notifications?.push ?? currentPrefs.notifications.push
          },
          privacy: {
            showEmail: request.preferences.privacy?.showEmail ?? currentPrefs.privacy.showEmail,
            showFavorites: request.preferences.privacy?.showFavorites ?? currentPrefs.privacy.showFavorites
          }
        };
      }

      // Update profile
      user.updateProfile(updatedProfile);

      // Save updated user
      const savedUser = await this.userRepository.save(user);

      this.logger.info('User profile updated successfully', { userId: request.userId });

      return {
        user: savedUser,
        success: true,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      this.logger.error('Failed to update user profile', error as Error, { userId: request.userId });
      return {
        user: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  }
}