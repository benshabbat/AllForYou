import React, { Suspense, ComponentType, LazyExoticComponent } from 'react';

// Define loading state type
interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Generic loading fallback component
interface LoadingFallbackProps {
  error?: Error;
  retry?: () => void;
  className?: string;
}

const DefaultLoadingFallback: React.FC<LoadingFallbackProps> = ({ className }) => (
  <div className={`loading-container ${className || ''}`}>
    <div className="loading-spinner" />
    <span>טוען...</span>
  </div>
);

// Error boundary for lazy loaded components
interface LazyErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class LazyErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: ComponentType<LoadingFallbackProps> }>,
  LazyErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ fallback?: ComponentType<LoadingFallbackProps> }>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): LazyErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultLoadingFallback;
      return (
        <FallbackComponent
          error={this.state.error!}
          retry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

// Enhanced lazy loading options
interface LazyComponentOptions {
  fallback?: ComponentType<LoadingFallbackProps>;
  errorFallback?: ComponentType<LoadingFallbackProps>;
  retryAttempts?: number;
  retryDelay?: number;
}

// Enhanced lazy loading with retry logic
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): LazyExoticComponent<T> {
  const {
    retryAttempts = 3,
    retryDelay = 1000,
  } = options;

  let attempts = 0;

  const retryableImport = async (): Promise<{ default: T }> => {
    try {
      return await importFunc();
    } catch (error) {
      attempts++;
      
      if (attempts >= retryAttempts) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
      return retryableImport();
    }
  };

  return React.lazy(retryableImport);
}

// HOC for lazy loading with enhanced features
export function withLazyLoading<P extends object>(
  Component: LazyExoticComponent<ComponentType<P>>,
  options: LazyComponentOptions = {}
) {
  const FallbackComponent = options.fallback || DefaultLoadingFallback;
  const ErrorFallbackComponent = options.errorFallback || undefined;

  return React.forwardRef<any, P>((props, ref) => (
    <LazyErrorBoundary {...(ErrorFallbackComponent && { fallback: ErrorFallbackComponent })}>
      <Suspense fallback={React.createElement(FallbackComponent)}>
        <Component {...props} ref={ref} />
      </Suspense>
    </LazyErrorBoundary>
  ));
}

// Route-based code splitting helper
export function createLazyRoute<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallbackComponent?: ComponentType<LoadingFallbackProps>
) {
  const LazyComponent = createLazyComponent(importFunc, {
    ...(fallbackComponent && { fallback: fallbackComponent }),
    retryAttempts: 2,
    retryDelay: 1500,
  });

  return withLazyLoading(LazyComponent, {
    ...(fallbackComponent && { fallback: fallbackComponent }),
  });
}

// Preload utility for better UX
interface PreloadableComponent<T extends ComponentType<any>> extends LazyExoticComponent<T> {
  preload: () => Promise<{ default: T }>;
}

export function createPreloadableComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): PreloadableComponent<T> {
  const LazyComponent = createLazyComponent(importFunc, options) as PreloadableComponent<T>;
  
  LazyComponent.preload = importFunc;
  
  return LazyComponent;
}

// Bundle loading progress tracker
class BundleLoadTracker {
  private loadingPromises = new Map<string, Promise<any>>();
  private loadingStates = new Map<string, LoadingState>();
  private listeners = new Set<(state: Map<string, LoadingState>) => void>();

  track<T>(key: string, promise: Promise<T>): Promise<T> {
    this.setLoading(key, true);
    this.loadingPromises.set(key, promise);

    promise
      .then(() => this.setLoading(key, false))
      .catch((error) => this.setError(key, error.message))
      .finally(() => this.loadingPromises.delete(key));

    return promise;
  }

  private setLoading(key: string, isLoading: boolean) {
    this.loadingStates.set(key, {
      isLoading,
      error: isLoading ? null : this.loadingStates.get(key)?.error || null,
    });
    this.notifyListeners();
  }

  private setError(key: string, error: string) {
    this.loadingStates.set(key, { isLoading: false, error });
    this.notifyListeners();
  }

  subscribe(listener: (state: Map<string, LoadingState>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(new Map(this.loadingStates)));
  }

  getState(key: string): LoadingState | undefined {
    return this.loadingStates.get(key);
  }

  getAllStates(): Map<string, LoadingState> {
    return new Map(this.loadingStates);
  }
}

export const bundleTracker = new BundleLoadTracker();

// Hook for tracking bundle loading states
export function useBundleLoadingState(key?: string) {
  const [states, setStates] = React.useState(() => bundleTracker.getAllStates());

  React.useEffect(() => {
    return bundleTracker.subscribe(setStates);
  }, []);

  if (key) {
    return states.get(key) || { isLoading: false, error: null };
  }

  return states;
}

// Utility to prefetch routes on hover/focus
export function usePrefetchRoute(
  importFunc: () => Promise<any>,
  shouldPrefetch: boolean = true
) {
  const prefetchRef = React.useRef<() => Promise<any>>();
  prefetchRef.current = importFunc;

  const prefetch = React.useCallback(() => {
    if (shouldPrefetch && prefetchRef.current) {
      bundleTracker.track('prefetch', prefetchRef.current());
    }
  }, [shouldPrefetch]);

  return {
    onMouseEnter: prefetch,
    onFocus: prefetch,
  };
}

// Performance optimization utility for route components
export function createOptimizedRoute<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  preloadCondition?: () => boolean
) {
  const LazyComponent = createLazyRoute(importFunc);
  
  // Add preloading capability
  if (preloadCondition) {
    setTimeout(() => {
      if (preloadCondition()) {
        importFunc();
      }
    }, 2000); // Preload after 2 seconds if condition is met
  }

  return LazyComponent;
}