// Export all types from common
export * from './common';

// Export all types from user
export * from './user';

// Export all types from recipe
export * from './recipe';

// Export all types from domain
export * from './domain';

// Re-export React types that are commonly used
export type {
  FC,
  ReactNode,
  ReactElement,
  ComponentType,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  FormHTMLAttributes,
  MouseEvent,
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  FocusEvent,
} from 'react';

export type {
  RouteObject,
  NavigateOptions,
  Location,
} from 'react-router-dom';