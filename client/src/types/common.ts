// Common API response types
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Form types
export interface FormState<T = any> extends LoadingState {
  data: T;
  isDirty: boolean;
  isValid: boolean;
}

// Modal types
export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  autoClose?: boolean;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface Theme {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    wide: string;
  };
}

// Generic utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type WithTimestamps<T> = T & {
  createdAt: string;
  updatedAt: string;
};

export type WithId<T> = T & {
  _id: string;
};

// Event handler types
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void;
export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void;
export type SubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
export type KeyboardHandler = (event: React.KeyboardEvent<HTMLElement>) => void;