import { useState, useCallback } from 'react';
import { ApiError } from '../types';
import logger from '../utils/logger';

interface UseErrorHandlingReturn {
  error: string | null;
  isError: boolean;
  clearError: () => void;
  handleError: (error: unknown) => void;
  handleAsyncError: <T>(asyncFn: () => Promise<T>) => Promise<T | null>;
}

export const useErrorHandling = (): UseErrorHandlingReturn => {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const formatError = useCallback((error: unknown): string => {
    // Handle different error types
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    // Handle API errors
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as ApiError).message;
    }

    // Handle network errors
    if (error && typeof error === 'object' && 'response' in error) {
      const networkError = error as any;
      if (networkError.response?.data?.message) {
        return networkError.response.data.message;
      }
      if (networkError.response?.status === 404) {
        return 'המשאב המבוקש לא נמצא';
      }
      if (networkError.response?.status === 500) {
        return 'שגיאה בשרת. אנא נסו שוב מאוחר יותר';
      }
      if (networkError.response?.status >= 400) {
        return 'שגיאה בבקשה. אנא בדקו את הפרטים ונסו שוב';
      }
    }

    return 'אירעה שגיאה בלתי צפויה';
  }, []);

  const handleError = useCallback((error: unknown) => {
    const errorMessage = formatError(error);
    setError(errorMessage);
    
    // Log error for debugging/monitoring
    if (error instanceof Error) {
      logger.captureException(error, {
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });
    } else {
      logger.captureMessage(errorMessage, 'error');
    }
  }, [formatError]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>
  ): Promise<T | null> => {
    try {
      clearError();
      return await asyncFn();
    } catch (error) {
      handleError(error);
      return null;
    }
  }, [clearError, handleError]);

  return {
    error,
    isError: !!error,
    clearError,
    handleError,
    handleAsyncError,
  };
};

// Hook for retrying failed operations
interface UseRetryReturn {
  retry: () => void;
  retryCount: number;
  isRetrying: boolean;
  canRetry: boolean;
}

export const useRetry = (
  operation: () => Promise<void>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): UseRetryReturn => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async () => {
    if (retryCount >= maxRetries) {
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      // Add exponential backoff
      const delay = retryDelay * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      await operation();
    } catch (error) {
      logger.captureException(error as Error, {
        retryAttempt: retryCount + 1,
        maxRetries,
      });
    } finally {
      setIsRetrying(false);
    }
  }, [operation, maxRetries, retryDelay, retryCount]);

  return {
    retry,
    retryCount,
    isRetrying,
    canRetry: retryCount < maxRetries,
  };
};

// Hook for handling form errors
interface UseFormErrorReturn {
  fieldErrors: Record<string, string>;
  setFieldError: (field: string, error: string) => void;
  clearFieldError: (field: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
  getFieldError: (field: string) => string | undefined;
}

export const useFormErrors = (): UseFormErrorReturn => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setFieldError = useCallback((field: string, error: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const { [field]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const getFieldError = useCallback((field: string) => {
    return fieldErrors[field];
  }, [fieldErrors]);

  return {
    fieldErrors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors: Object.keys(fieldErrors).length > 0,
    getFieldError,
  };
};