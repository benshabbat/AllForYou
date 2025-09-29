// SOLID Principles Implementation - Interface Segregation Principle (ISP)
// Dependency Inversion Principle (DIP)

// Base interfaces for clean architecture
export interface IRepository<T, K = string> {
  findById(id: K): Promise<T | null>;
  findAll(filters?: Record<string, any>): Promise<T[]>;
  create(entity: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: K, updates: Partial<T>): Promise<T | null>;
  delete(id: K): Promise<boolean>;
}

export interface IUseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}

export interface IValidator<T> {
  validate(data: T): Promise<ValidationResult>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Domain Events (for decoupling)
export interface IDomainEvent {
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventType: string;
}

export interface IEventHandler<T extends IDomainEvent> {
  handle(event: T): Promise<void>;
}

export interface IEventDispatcher {
  dispatch<T extends IDomainEvent>(event: T): Promise<void>;
  subscribe<T extends IDomainEvent>(eventType: string, handler: IEventHandler<T>): void;
}

// Logger abstraction
export interface ILogger {
  info(message: string, meta?: Record<string, any>): void;
  error(message: string, error?: Error, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  debug(message: string, meta?: Record<string, any>): void;
}

// Cache abstraction
export interface ICache<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Email service abstraction
export interface IEmailService {
  sendEmail(to: string, subject: string, body: string, options?: EmailOptions): Promise<void>;
}

export interface EmailOptions {
  isHtml?: boolean;
  attachments?: EmailAttachment[];
  replyTo?: string;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

// File storage abstraction
export interface IFileStorage {
  upload(file: FileInput, path: string): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
}

export interface FileInput {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

// Database transaction abstraction
export interface ITransaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface ITransactionManager {
  withTransaction<T>(callback: (transaction: ITransaction) => Promise<T>): Promise<T>;
}