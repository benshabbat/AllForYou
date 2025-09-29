// User Repository Implementation - Clean Architecture
// Dependency Inversion Principle - Depends on abstractions, not concretions
// Interface Segregation Principle - Specific interfaces for different needs

import { IRepository, ILogger } from '../interfaces';
import { User, UserRole, UserStatus } from '../domain/user';

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByRole(role: UserRole): Promise<User[]>;
  findByStatus(status: UserStatus): Promise<User[]>;
  findActiveUsers(): Promise<User[]>;
  findLockedUsers(): Promise<User[]>;
  existsByEmail(email: string): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;
  save(user: User): Promise<User>;
}

export class MongoUserRepository implements IUserRepository {
  constructor(
    private readonly userModel: any, // MongoDB model
    private readonly logger: ILogger
  ) {}

  async findById(id: string): Promise<User | null> {
    try {
      const userData = await this.userModel.findById(id);
      return userData ? User.fromPersistence(userData.toObject()) : null;
    } catch (error) {
      this.logger.error('Failed to find user by ID', error as Error, { id });
      throw new Error('Database operation failed');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const userData = await this.userModel.findOne({ email: email.toLowerCase() });
      return userData ? User.fromPersistence(userData.toObject()) : null;
    } catch (error) {
      this.logger.error('Failed to find user by email', error as Error, { email });
      throw new Error('Database operation failed');
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const userData = await this.userModel.findOne({ username });
      return userData ? User.fromPersistence(userData.toObject()) : null;
    } catch (error) {
      this.logger.error('Failed to find user by username', error as Error, { username });
      throw new Error('Database operation failed');
    }
  }

  async findAll(filters?: Record<string, any>): Promise<User[]> {
    try {
      const query = this.buildQuery(filters);
      const usersData = await this.userModel.find(query);
      return usersData.map((userData: any) => User.fromPersistence(userData.toObject()));
    } catch (error) {
      this.logger.error('Failed to find users', error as Error, { filters });
      throw new Error('Database operation failed');
    }
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.findAll({ role });
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    return this.findAll({ status });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.findByStatus(UserStatus.ACTIVE);
  }

  async findLockedUsers(): Promise<User[]> {
    try {
      const now = new Date();
      const usersData = await this.userModel.find({
        'security.lockUntil': { $gt: now }
      });
      return usersData.map((userData: any) => User.fromPersistence(userData.toObject()));
    } catch (error) {
      this.logger.error('Failed to find locked users', error as Error);
      throw new Error('Database operation failed');
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const count = await this.userModel.countDocuments({ email: email.toLowerCase() });
      return count > 0;
    } catch (error) {
      this.logger.error('Failed to check user existence by email', error as Error, { email });
      throw new Error('Database operation failed');
    }
  }

  async existsByUsername(username: string): Promise<boolean> {
    try {
      const count = await this.userModel.countDocuments({ username });
      return count > 0;
    } catch (error) {
      this.logger.error('Failed to check user existence by username', error as Error, { username });
      throw new Error('Database operation failed');
    }
  }

  async create(userEntity: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      // Convert domain entity to persistence format
      const userData = (userEntity as any).toPersistence();
      const savedUser = await this.userModel.create(userData);
      
      this.logger.info('User created successfully', { 
        userId: savedUser._id, 
        username: userData.username 
      });
      
      return User.fromPersistence(savedUser.toObject());
    } catch (error) {
      this.logger.error('Failed to create user', error as Error, { 
        username: (userEntity as any).username?.value 
      });
      throw new Error('Database operation failed');
    }
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      // Convert domain entity updates to persistence format
      const updateData = this.preparePersistenceUpdates(updates);
      
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { $set: updateData, updatedAt: new Date() },
        { new: true }
      );

      if (!updatedUser) {
        return null;
      }

      this.logger.info('User updated successfully', { userId: id });
      return User.fromPersistence(updatedUser.toObject());
    } catch (error) {
      this.logger.error('Failed to update user', error as Error, { userId: id });
      throw new Error('Database operation failed');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.userModel.findByIdAndDelete(id);
      const success = result !== null;
      
      if (success) {
        this.logger.info('User deleted successfully', { userId: id });
      }
      
      return success;
    } catch (error) {
      this.logger.error('Failed to delete user', error as Error, { userId: id });
      throw new Error('Database operation failed');
    }
  }

  // Save method for updating existing domain entities
  async save(user: User): Promise<User> {
    try {
      const userData = user.toPersistence();
      const updatedUser = await this.userModel.findByIdAndUpdate(
        user.id,
        userData,
        { new: true, upsert: true }
      );

      this.logger.info('User saved successfully', { userId: user.id });
      return User.fromPersistence(updatedUser.toObject());
    } catch (error) {
      this.logger.error('Failed to save user', error as Error, { userId: user.id });
      throw new Error('Database operation failed');
    }
  }

  private buildQuery(filters?: Record<string, any>): Record<string, any> {
    if (!filters) return {};

    const query: Record<string, any> = {};

    // Handle common filter patterns
    if (filters.role) query.role = filters.role;
    if (filters.status) query.status = filters.status;
    if (filters.emailVerified !== undefined) {
      query['security.emailVerified'] = filters.emailVerified;
    }
    if (filters.createdAfter) {
      query.createdAt = { $gte: new Date(filters.createdAfter) };
    }
    if (filters.createdBefore) {
      query.createdAt = { ...query.createdAt, $lte: new Date(filters.createdBefore) };
    }

    return query;
  }

  private preparePersistenceUpdates(updates: Partial<User>): Record<string, any> {
    const updateData: Record<string, any> = {};

    // Handle specific field updates that need transformation
    // This is where domain entity properties are mapped to persistence format
    Object.keys(updates).forEach(key => {
      const value = (updates as any)[key];
      
      // Transform domain objects to primitive values for persistence
      if (key === 'email' && value?.value) {
        updateData.email = value.value;
      } else if (key === 'username' && value?.value) {
        updateData.username = value.value;
      } else if (key === 'password' && value?.hash) {
        updateData.password = value.hash;
      } else {
        updateData[key] = value;
      }
    });

    return updateData;
  }
}