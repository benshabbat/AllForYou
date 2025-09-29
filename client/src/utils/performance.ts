import React from 'react';

// Simple debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Simple throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Utility for creating stable references
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const ref = React.useRef<T>();
  ref.current = callback;
  
  return React.useCallback((...args: any[]) => {
    return ref.current?.(...args);
  }, []) as T;
}

// Performance utilities
export const performanceUtils = {
  // Measure component render time
  measureRender: (componentName: string, fn: () => void) => {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now();
      fn();
      const endTime = performance.now();
      console.log(`${componentName} render time: ${endTime - startTime}ms`);
    } else {
      fn();
    }
  },

  // Log long tasks
  logLongTask: (taskName: string, duration: number) => {
    if (duration > 16.67) { // More than one frame (60fps)
      console.warn(`Long task detected: ${taskName} took ${duration}ms`);
    }
  },

  // Batch DOM updates
  batchUpdates: (updates: (() => void)[]) => {
    requestAnimationFrame(() => {
      updates.forEach(update => update());
    });
  }
};