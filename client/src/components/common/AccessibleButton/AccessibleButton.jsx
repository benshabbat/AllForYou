// Accessible Button Component - WCAG 2.1 AA Compliance
// Enhanced button with proper focus indicators, ARIA support, and keyboard handling

import React, { forwardRef } from 'react';
import { useFocusVisible } from '../../../utils/accessibilityUtils';
import './AccessibleButton.module.css';

const AccessibleButton = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  ariaLabel,
  ariaDescribedBy,
  ariaPressed,
  ariaExpanded,
  ariaHaspopup,
  ariaControls,
  role = 'button',
  type = 'button',
  className = '',
  onClick,
  onKeyDown,
  ...props
}, ref) => {
  const { 
    isFocusVisible, 
    onFocus, 
    onBlur, 
    onMouseDown, 
    onKeyDown: onKeyDownFocus 
  } = useFocusVisible();

  const handleClick = (event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const handleKeyDown = (event) => {
    onKeyDownFocus(event);
    
    // Handle Space key for button activation
    if (event.key === ' ' && role === 'button') {
      event.preventDefault();
      handleClick(event);
    }
    
    onKeyDown?.(event);
  };

  const buttonClasses = [
    'accessible-button',
    `accessible-button--${variant}`,
    `accessible-button--${size}`,
    disabled && 'accessible-button--disabled',
    loading && 'accessible-button--loading',
    isFocusVisible && 'accessible-button--focus-visible',
    className
  ].filter(Boolean).join(' ');

  const ariaProps = {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-pressed': ariaPressed,
    'aria-expanded': ariaExpanded,
    'aria-haspopup': ariaHaspopup,
    'aria-controls': ariaControls,
    'aria-disabled': disabled || loading
  };

  return (
    <button
      ref={ref}
      type={type}
      role={role}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={onMouseDown}
      {...ariaProps}
      {...props}
    >
      <span className="accessible-button__content">
        {loading ? (
          <>
            <span className="accessible-button__spinner" aria-hidden="true" />
            <span className="accessible-button__text">
              {loadingText}
            </span>
          </>
        ) : (
          <span className="accessible-button__text">
            {children}
          </span>
        )}
      </span>
    </button>
  );
});

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;