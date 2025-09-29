import { Component, ErrorInfo, ReactNode } from 'react';
import logger from '../../../utils/logger';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught An Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }

    // Log error to external service
    const eventId = logger.captureException(error, {
      tags: {
        component: 'ErrorBoundary',
      },
      extra: {
        errorInfo,
        props: this.props,
      },
    });

    this.setState({
      error,
      errorInfo,
      eventId,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props): void {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetOnPropsChange) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = (): void => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    });
  };

  handleRetry = (): void => {
    this.resetErrorBoundary();
  };

  handleReload = (): void => {
    window.location.reload();
  };

  getErrorMessage(error: Error): string {
    if (error.name === 'ChunkLoadError') {
      return 'שגיאה בטעינת האפליקציה. אנא רעננו את הדף.';
    }

    if (error.message.includes('Network Error')) {
      return 'שגיאת רשת. אנא בדקו את החיבור לאינטרנט.';
    }

    if (error.message.includes('Loading chunk')) {
      return 'שגיאה בטעינת חלק מהאפליקציה. אנא רעננו את הדף.';
    }

    return 'אירעה שגיאה בלתי צפויה. אנא נסו שוב.';
  }

  getErrorDetails(): { title: string; description: string; canRetry: boolean } {
    const { error } = this.state;

    if (!error) {
      return {
        title: 'שגיאה לא ידועה',
        description: 'אירעה שגיאה בלתי צפויה.',
        canRetry: true,
      };
    }

    // Handle network errors
    if (error.message.includes('Network Error') || error.message.includes('fetch')) {
      return {
        title: 'שגיאת חיבור',
        description: 'לא ניתן להתחבר לשרת. אנא בדקו את החיבור לאינטרנט ונסו שוב.',
        canRetry: true,
      };
    }

    // Handle chunk loading errors
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      return {
        title: 'שגיאת טעינה',
        description: 'נכשל בטעינת חלק מהאפליקציה. ייתכן שיש עדכון זמין.',
        canRetry: false, // These usually require a page reload
      };
    }

    // Handle authentication errors
    if (error.message.includes('Unauthorized') || error.message.includes('401')) {
      return {
        title: 'שגיאת הזדהות',
        description: 'פגה תוקף ההתחברות. אנא התחברו מחדש.',
        canRetry: false,
      };
    }

    // Default error
    return {
      title: 'שגיאה טכנית',
      description: this.getErrorMessage(error),
      canRetry: true,
    };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { title, description, canRetry } = this.getErrorDetails();

      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            <h2 className={styles.errorTitle}>{title}</h2>
            <p className={styles.errorDescription}>{description}</p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorDetails}>
                <summary>פרטים טכניים</summary>
                <pre className={styles.errorStack}>
                  {this.state.error.stack}
                </pre>
                {this.state.errorInfo && (
                  <pre className={styles.errorStack}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            <div className={styles.errorActions}>
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className={`${styles.errorButton} ${styles.primaryButton}`}
                >
                  נסו שוב
                </button>
              )}
              
              <button
                onClick={this.handleReload}
                className={`${styles.errorButton} ${styles.secondaryButton}`}
              >
                רעננו את הדף
              </button>
            </div>

            {this.state.eventId && (
              <p className={styles.errorId}>
                מזהה שגיאה: {this.state.eventId}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;