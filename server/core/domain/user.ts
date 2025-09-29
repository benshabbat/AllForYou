// User Domain Entity - Clean Architecture & DDD
// Single Responsibility Principle - User entity manages user state and behavior only
// Open/Closed Principle - Extensible through composition, not modification

import { BaseEntity, Email, Password, Username, UserRegisteredEvent, UserEmailChangedEvent } from './base';

export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export interface UserProfile {
  bio?: string;
  profilePicture?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
  };
  privacy: {
    showEmail: boolean;
    showFavorites: boolean;
  };
}

export interface UserSecuritySettings {
  loginAttempts: number;
  lockUntil?: Date;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  refreshToken?: string;
}

export class User extends BaseEntity {
  private _username: Username;
  private _email: Email;
  private _password: Password;
  private _role: UserRole;
  private _status: UserStatus;
  private _allergenPreferences: string[];
  private _favorites: string[];
  private _lastLogin?: Date;
  private _profile: UserProfile;
  private _security: UserSecuritySettings;

  constructor(
    id: string,
    username: Username,
    email: Email,
    password: Password,
    role: UserRole = UserRole.USER,
    status: UserStatus = UserStatus.PENDING,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this._username = username;
    this._email = email;
    this._password = password;
    this._role = role;
    this._status = status;
    this._allergenPreferences = [];
    this._favorites = [];
    this._profile = this.createDefaultProfile();
    this._security = this.createDefaultSecuritySettings();
  }

  // Getters following encapsulation principles
  get username(): Username {
    return this._username;
  }

  get email(): Email {
    return this._email;
  }

  get role(): UserRole {
    return this._role;
  }

  get status(): UserStatus {
    return this._status;
  }

  get allergenPreferences(): readonly string[] {
    return Object.freeze([...this._allergenPreferences]);
  }

  get favorites(): readonly string[] {
    return Object.freeze([...this._favorites]);
  }

  get lastLogin(): Date | undefined {
    return this._lastLogin;
  }

  get profile(): UserProfile {
    return { ...this._profile };
  }

  get isEmailVerified(): boolean {
    return this._security.emailVerified;
  }

  get isTwoFactorEnabled(): boolean {
    return this._security.twoFactorEnabled;
  }

  get isLocked(): boolean {
    return this._security.lockUntil ? this._security.lockUntil > new Date() : false;
  }

  // Business logic methods
  static create(
    id: string,
    username: string,
    email: string,
    plainPassword: string
  ): Promise<User> {
    return this.createAsync(id, username, email, plainPassword);
  }

  private static async createAsync(
    id: string,
    username: string,
    email: string,
    plainPassword: string
  ): Promise<User> {
    const usernameObj = new Username(username);
    const emailObj = new Email(email);
    const passwordObj = await Password.create(plainPassword);

    const user = new User(id, usernameObj, emailObj, passwordObj);
    
    // Domain event for user registration
    user.addDomainEvent(new UserRegisteredEvent(id, email, username));
    
    return user;
  }

  async verifyPassword(plainPassword: string): Promise<boolean> {
    return this._password.verify(plainPassword);
  }

  async changePassword(newPlainPassword: string): Promise<void> {
    const newPassword = await Password.create(newPlainPassword);
    this._password = newPassword;
    this.resetSecurityLock();
    this.touch();
  }

  changeEmail(newEmail: string): void {
    const oldEmail = this._email.value;
    const newEmailObj = new Email(newEmail);
    
    if (!this._email.equals(newEmailObj)) {
      this._email = newEmailObj;
      this._security.emailVerified = false;
      this.touch();
      
      // Domain event for email change
      this.addDomainEvent(new UserEmailChangedEvent(this.id, oldEmail, newEmail));
    }
  }

  updateProfile(profile: Partial<UserProfile>): void {
    this._profile = { ...this._profile, ...profile };
    this.touch();
  }

  activate(): void {
    if (this._status !== UserStatus.ACTIVE) {
      this._status = UserStatus.ACTIVE;
      this.touch();
    }
  }

  suspend(reason?: string): void {
    this._status = UserStatus.SUSPENDED;
    this.touch();
  }

  verifyEmail(): void {
    this._security.emailVerified = true;
    if (this._status === UserStatus.PENDING) {
      this.activate();
    }
    this.touch();
  }

  enableTwoFactor(): void {
    this._security.twoFactorEnabled = true;
    this.touch();
  }

  disableTwoFactor(): void {
    this._security.twoFactorEnabled = false;
    this.touch();
  }

  recordLoginAttempt(): void {
    this._security.loginAttempts += 1;
    
    // Lock account after 5 failed attempts for 30 minutes
    if (this._security.loginAttempts >= 5) {
      this._security.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
    }
    
    this.touch();
  }

  recordSuccessfulLogin(): void {
    this._lastLogin = new Date();
    this.resetSecurityLock();
    this.touch();
  }

  addAllergenPreference(allergen: string): void {
    if (!this._allergenPreferences.includes(allergen)) {
      this._allergenPreferences.push(allergen);
      this.touch();
    }
  }

  removeAllergenPreference(allergen: string): void {
    const index = this._allergenPreferences.indexOf(allergen);
    if (index > -1) {
      this._allergenPreferences.splice(index, 1);
      this.touch();
    }
  }

  addToFavorites(recipeId: string): void {
    if (!this._favorites.includes(recipeId)) {
      this._favorites.push(recipeId);
      this.touch();
    }
  }

  removeFromFavorites(recipeId: string): void {
    const index = this._favorites.indexOf(recipeId);
    if (index > -1) {
      this._favorites.splice(index, 1);
      this.touch();
    }
  }

  hasPermission(permission: string): boolean {
    const rolePermissions = {
      [UserRole.USER]: ['read:own', 'write:own'],
      [UserRole.MODERATOR]: ['read:own', 'write:own', 'moderate:content'],
      [UserRole.ADMIN]: ['read:all', 'write:all', 'moderate:content', 'manage:users']
    };

    return rolePermissions[this._role]?.includes(permission) || false;
  }

  canModerate(): boolean {
    return this._role === UserRole.MODERATOR || this._role === UserRole.ADMIN;
  }

  isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }

  // Serialization method (for persistence)
  toPersistence(): any {
    return {
      _id: this.id,
      username: this._username.value,
      email: this._email.value,
      password: this._password.hash,
      role: this._role,
      status: this._status,
      allergenPreferences: this._allergenPreferences,
      favorites: this._favorites,
      lastLogin: this._lastLogin,
      profile: this._profile,
      security: this._security,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Factory method for reconstruction from persistence
  static fromPersistence(data: any): User {
    const user = new User(
      data._id,
      new Username(data.username),
      new Email(data.email),
      new Password(data.password),
      data.role,
      data.status,
      data.createdAt,
      data.updatedAt
    );

    user._allergenPreferences = data.allergenPreferences || [];
    user._favorites = data.favorites || [];
    user._lastLogin = data.lastLogin;
    user._profile = data.profile || user.createDefaultProfile();
    user._security = data.security || user.createDefaultSecuritySettings();

    return user;
  }

  private createDefaultProfile(): UserProfile {
    return {
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          push: true
        },
        privacy: {
          showEmail: false,
          showFavorites: true
        }
      }
    };
  }

  private createDefaultSecuritySettings(): UserSecuritySettings {
    return {
      loginAttempts: 0,
      emailVerified: false,
      twoFactorEnabled: false
    };
  }

  private resetSecurityLock(): void {
    this._security.loginAttempts = 0;
    this._security.lockUntil = undefined;
  }
}