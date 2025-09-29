// Domain Entities - Clean Architecture & DDD
// Single Responsibility Principle (SRP) - Each entity has one reason to change

import { IDomainEvent } from '../interfaces';

// Base Entity class
export abstract class BaseEntity {
  protected _id: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  private _domainEvents: IDomainEvent[] = [];

  constructor(id: string, createdAt?: Date, updatedAt?: Date) {
    this._id = id;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  getDomainEvents(): IDomainEvent[] {
    return [...this._domainEvents];
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  clearEvents(): void {
    this.clearDomainEvents();
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }
}

// Base Domain Event class
export abstract class DomainEvent implements IDomainEvent {
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventType: string;

  constructor(eventType: string) {
    this.eventId = `${eventType}-${Date.now()}-${Math.random()}`;
    this.occurredOn = new Date();
    this.eventType = eventType;
  }
}

// Value Objects - Immutable objects that describe aspects of the domain
export class Email {
  private readonly _value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error('Invalid email format');
    }
    this._value = email.toLowerCase();
  }

  get value(): string {
    return this._value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}

export class Password {
  private readonly _hash: string;

  constructor(hash: string) {
    this._hash = hash;
  }

  get hash(): string {
    return this._hash;
  }

  static async create(plainPassword: string): Promise<Password> {
    if (!this.isStrong(plainPassword)) {
      throw new Error('Password does not meet strength requirements');
    }
    
    const bcrypt = (await import('bcryptjs')).default;
    const hash = await bcrypt.hash(plainPassword, 12);
    return new Password(hash);
  }

  async verify(plainPassword: string): Promise<boolean> {
    const bcrypt = (await import('bcryptjs')).default;
    return bcrypt.compare(plainPassword, this._hash);
  }

  private static isStrong(password: string): boolean {
    // At least 8 characters, one uppercase, one lowercase, one number, one special char
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }
}

export class Username {
  private readonly _value: string;

  constructor(username: string) {
    if (!this.isValid(username)) {
      throw new Error('Invalid username format');
    }
    this._value = username;
  }

  get value(): string {
    return this._value;
  }

  private isValid(username: string): boolean {
    // 3-30 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
  }

  equals(other: Username): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}

// Domain Events
export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly username: string
  ) {
    super('UserRegistered');
  }
}

export class UserEmailChangedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly oldEmail: string,
    public readonly newEmail: string
  ) {
    super('UserEmailChanged');
  }
}

export class RecipeCreatedEvent extends DomainEvent {
  constructor(
    public readonly recipeId: string,
    public readonly authorId: string,
    public readonly recipeName: string
  ) {
    super('RecipeCreated');
  }
}