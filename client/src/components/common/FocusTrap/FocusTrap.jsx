// Focus Management Component - WCAG 2.1 AA Compliance
// Manages focus for modals, dialogs, and other interactive elements

import React, { useEffect, useRef, useCallback } from 'react';
import { FocusManager } from '../../../utils/accessibilityUtils';

const FocusTrap = ({ 
  children, 
  isActive = true, 
  autoFocus = true,
  restoreFocus = true,
  className = '',
  onEscape,
  ...props 
}) => {
  const containerRef = useRef(null);
  const previousActiveElement = useRef(null);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape' && onEscape) {
      onEscape(event);
    }
  }, [onEscape]);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement;

    // Set up focus trap
    const cleanup = FocusManager.trapFocus(containerRef.current);

    // Add escape key listener
    document.addEventListener('keydown', handleKeyDown);

    // Auto focus if requested
    if (autoFocus) {
      const focusableElements = FocusManager.getFocusableElements(containerRef.current);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    return () => {
      cleanup();
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to previous element
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, autoFocus, restoreFocus, handleKeyDown]);

  if (!isActive) {
    return children;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

// Focus Guard Components - prevent focus from escaping trap
export const FocusGuard = ({ onFocus }) => (
  <div
    tabIndex={0}
    onFocus={onFocus}
    style={{
      position: 'fixed',
      top: '1px',
      left: '1px',
      width: '1px',
      height: '0px',
      padding: '0px',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0px, 0px, 0px, 0px)',
      whiteSpace: 'nowrap',
      border: '0px'
    }}
    aria-hidden="true"
  />
);

// Hook for managing focus
export const useFocusManagement = (isActive = true) => {
  const containerRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const moveFocus = useCallback((direction) => {
    if (!containerRef.current) return;

    const focusableElements = FocusManager.getFocusableElements(containerRef.current);
    if (focusableElements.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = focusedIndex === -1 ? 0 : (focusedIndex + 1) % focusableElements.length;
    } else if (direction === 'previous') {
      newIndex = focusedIndex === -1 ? 
        focusableElements.length - 1 : 
        (focusedIndex - 1 + focusableElements.length) % focusableElements.length;
    } else if (direction === 'first') {
      newIndex = 0;
    } else if (direction === 'last') {
      newIndex = focusableElements.length - 1;
    } else {
      return;
    }

    setFocusedIndex(newIndex);
    focusableElements[newIndex].focus();
  }, [focusedIndex]);

  const handleKeyDown = useCallback((event) => {
    if (!isActive) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        moveFocus('next');
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        moveFocus('previous');
        break;
      case 'Home':
        event.preventDefault();
        moveFocus('first');
        break;
      case 'End':
        event.preventDefault();
        moveFocus('last');
        break;
      default:
        break;
    }
  }, [isActive, moveFocus]);

  return {
    containerRef,
    focusedIndex,
    moveFocus,
    handleKeyDown
  };
};

export default FocusTrap;