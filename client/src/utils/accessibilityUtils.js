// Accessibility Utilities - WCAG 2.1 AA Compliance
// Web Content Accessibility Guidelines implementation utilities

import { useEffect, useRef, useState } from 'react';

// Focus Management Utilities
export class FocusManager {
  static focusStack = [];

  // Save current focus and set new focus
  static pushFocus(element) {
    const currentFocus = document.activeElement;
    if (currentFocus && currentFocus !== document.body) {
      this.focusStack.push(currentFocus);
    }
    element.focus();
  }

  // Restore previous focus
  static popFocus() {
    const previousFocus = this.focusStack.pop();
    if (previousFocus) {
      previousFocus.focus();
    }
  }

  // Clear focus stack
  static clearFocusStack() {
    this.focusStack = [];
  }

  // Get focusable elements within a container
  static getFocusableElements(container) {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      'details',
      'summary'
    ].join(',');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(el => {
        const element = el;
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               element.offsetWidth > 0 && 
               element.offsetHeight > 0;
      });
  }

  // Trap focus within a container
  static trapFocus(container) {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return () => {};

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Focus the first element
    firstElement.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
}

// Custom Hooks for Accessibility

// Focus trap hook for modals/dialogs
export function useFocusTrap(isActive) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const cleanup = FocusManager.trapFocus(containerRef.current);
    
    return cleanup;
  }, [isActive]);

  return containerRef;
}

// Announcements for screen readers
export function useScreenReaderAnnouncement() {
  const announcementRef = useRef(null);

  const announce = (message, priority = 'polite') => {
    if (announcementRef.current) {
      announcementRef.current.setAttribute('aria-live', priority);
      announcementRef.current.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  };

  return { announce, announcementRef };
}

// Keyboard navigation hook
export function useKeyboardNavigation(items, onSelect, isActive = true) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = (event) => {
    if (!isActive || items.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect(items[activeIndex], activeIndex);
        break;
      case 'Escape':
        // Handle escape key (close dropdown, dialog, etc.)
        event.preventDefault();
        break;
    }
  };

  return { activeIndex, setActiveIndex, handleKeyDown };
}

// Skip link component for keyboard navigation
export function useSkipLinks() {
  const skipLinksRef = useRef(null);
  const [skipLinks, setSkipLinks] = useState([]);

  const addSkipLink = (id, label) => {
    setSkipLinks(prev => [...prev.filter(link => link.id !== id), { id, label }]);
  };

  const removeSkipLink = (id) => {
    setSkipLinks(prev => prev.filter(link => link.id !== id));
  };

  return { skipLinksRef, addSkipLink, removeSkipLink };
}

// Reduced motion detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// High contrast mode detection
export function useHighContrast() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Check for Windows high contrast mode
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(mediaQuery.matches);

    const handleChange = () => setHighContrast(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return highContrast;
}

// Color contrast utilities
export class ColorContrastUtils {
  // Calculate relative luminance
  static getRelativeLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      const sRGB = c / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  // Calculate contrast ratio
  static getContrastRatio(color1, color2) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;

    const l1 = this.getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = this.getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  // Check WCAG compliance
  static isWCAGCompliant(foreground, background, level = 'AA') {
    const ratio = this.getContrastRatio(foreground, background);
    const threshold = level === 'AAA' ? 7 : 4.5;
    return ratio >= threshold;
  }

  // Convert hex to RGB
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}

// ARIA utilities
export class AriaUtils {
  // Generate unique IDs for ARIA relationships
  static generateId(prefix = 'aria') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Describe element for screen readers
  static describeElement(element, description) {
    const descriptionId = this.generateId('desc');
    const descriptionElement = document.createElement('div');
    descriptionElement.id = descriptionId;
    descriptionElement.className = 'sr-only';
    descriptionElement.textContent = description;
    
    document.body.appendChild(descriptionElement);
    element.setAttribute('aria-describedby', descriptionId);
    
    return descriptionId;
  }

  // Remove description
  static removeDescription(element, descriptionId) {
    element.removeAttribute('aria-describedby');
    const descriptionElement = document.getElementById(descriptionId);
    if (descriptionElement) {
      document.body.removeChild(descriptionElement);
    }
  }

  // Set live region
  static setLiveRegion(element, type = 'polite') {
    element.setAttribute('aria-live', type);
    element.setAttribute('aria-atomic', 'true');
  }

  // Remove live region
  static removeLiveRegion(element) {
    element.removeAttribute('aria-live');
    element.removeAttribute('aria-atomic');
  }
}

// Focus visible utility for custom focus indicators
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [wasKeyboardNav, setWasKeyboardNav] = useState(false);

  const onFocus = (event) => {
    if (wasKeyboardNav) {
      setIsFocusVisible(true);
    }
  };

  const onBlur = (event) => {
    setIsFocusVisible(false);
  };

  const onMouseDown = (event) => {
    setWasKeyboardNav(false);
    setIsFocusVisible(false);
  };

  const onKeyDown = (event) => {
    if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') {
      setWasKeyboardNav(true);
    }
  };

  return { isFocusVisible, onFocus, onBlur, onMouseDown, onKeyDown };
}

// Accessibility constants
export const ARIA_LABELS = {
  // Navigation
  mainNavigation: 'Main navigation',
  breadcrumb: 'Breadcrumb navigation',
  pagination: 'Pagination navigation',
  
  // Forms
  required: 'Required field',
  invalid: 'Invalid input',
  optional: 'Optional field',
  
  // Actions
  close: 'Close',
  menu: 'Menu',
  search: 'Search',
  submit: 'Submit',
  cancel: 'Cancel',
  edit: 'Edit',
  delete: 'Delete',
  
  // Status
  loading: 'Loading...',
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  
  // Content
  showMore: 'Show more',
  showLess: 'Show less',
  expand: 'Expand',
  collapse: 'Collapse'
};

// Keyboard key constants
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  TAB: 'Tab',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown'
};