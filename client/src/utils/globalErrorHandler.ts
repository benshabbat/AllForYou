import logger from './logger';

// Global error handler for unhandled promises and errors
class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorQueue: Error[] = [];
  private isProcessing = false;

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  init(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    
    // Handle global errors
    window.addEventListener('error', this.handleGlobalError);
    
    // Handle resource loading errors
    window.addEventListener('error', this.handleResourceError, true);
  }

  destroy(): void {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('error', this.handleResourceError, true);
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    event.preventDefault(); // Prevent console error
    
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    logger.captureException(error, {
      type: 'unhandledRejection',
      stack: error.stack,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });

    this.queueError(error);
  };

  private handleGlobalError = (event: ErrorEvent): void => {
    const error = new Error(event.message);
    error.stack = `${event.filename}:${event.lineno}:${event.colno}`;
    
    logger.captureException(error, {
      type: 'globalError',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });

    this.queueError(error);
  };

  private handleResourceError = (event: Event): void => {
    const target = event.target as HTMLElement;
    
    if (target && target.tagName) {
      const error = new Error(`Failed to load resource: ${target.tagName}`);
      
      logger.captureException(error, {
        type: 'resourceError',
        element: target.tagName,
        src: (target as any).src || (target as any).href,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    }
  };

  private queueError(error: Error): void {
    this.errorQueue.push(error);
    this.processErrorQueue();
  }

  private async processErrorQueue(): Promise<void> {
    if (this.isProcessing || this.errorQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.errorQueue.length > 0) {
        const error = this.errorQueue.shift();
        if (error) {
          await this.processError(error);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async processError(error: Error): Promise<void> {
    // In production, you might want to:
    // 1. Send to error reporting service
    // 2. Store in local storage for offline retry
    // 3. Show user-friendly notification
    
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Global Error Handler');
      console.error(error);
      console.groupEnd();
    }

    // Example: Send to error reporting endpoint
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (fetchError) {
      // Store in localStorage for retry later
      this.storeOfflineError(error);
    }
  }

  private storeOfflineError(error: Error): void {
    try {
      const storedErrors = JSON.parse(
        localStorage.getItem('offlineErrors') || '[]'
      );
      
      storedErrors.push({
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });

      // Keep only the last 10 errors to avoid storage bloat
      if (storedErrors.length > 10) {
        storedErrors.splice(0, storedErrors.length - 10);
      }

      localStorage.setItem('offlineErrors', JSON.stringify(storedErrors));
    } catch (storageError) {
      console.error('Failed to store offline error:', storageError);
    }
  }

  // Method to retry sending offline errors when connection is restored
  async retryOfflineErrors(): Promise<void> {
    try {
      const storedErrors = JSON.parse(
        localStorage.getItem('offlineErrors') || '[]'
      );

      if (storedErrors.length === 0) {
        return;
      }

      for (const errorData of storedErrors) {
        try {
          await fetch('/api/errors/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errorData),
          });
        } catch (fetchError) {
          // If still failing, keep the error for next retry
          break;
        }
      }

      // Clear successfully sent errors
      localStorage.removeItem('offlineErrors');
    } catch (error) {
      console.error('Failed to retry offline errors:', error);
    }
  }
}

// Initialize global error handler
export const initGlobalErrorHandler = (): GlobalErrorHandler => {
  const handler = GlobalErrorHandler.getInstance();
  handler.init();
  return handler;
};

// Cleanup global error handler
export const destroyGlobalErrorHandler = (): void => {
  const handler = GlobalErrorHandler.getInstance();
  handler.destroy();
};

export default GlobalErrorHandler;