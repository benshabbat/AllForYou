// Accessible Form Components - WCAG 2.1 AA Compliance
// Form field with proper labeling, validation, and error handling

import React, { forwardRef, useState, useCallback } from 'react';
import { AriaUtils, ARIA_LABELS } from '../../../utils/accessibilityUtils';
import './AccessibleForm.module.css';

// Form Field Component
export const FormField = forwardRef(({
  label,
  error,
  hint,
  required = false,
  children,
  className = '',
  labelClassName = '',
  errorClassName = '',
  hintClassName = '',
  ...props
}, ref) => {
  const [fieldId] = useState(() => AriaUtils.generateId('field'));
  const [errorId] = useState(() => AriaUtils.generateId('error'));
  const [hintId] = useState(() => AriaUtils.generateId('hint'));

  const fieldClasses = [
    'form-field',
    error && 'form-field--error',
    className
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'form-field__label',
    required && 'form-field__label--required',
    labelClassName
  ].filter(Boolean).join(' ');

  const errorClasses = [
    'form-field__error',
    errorClassName
  ].filter(Boolean).join(' ');

  const hintClasses = [
    'form-field__hint',
    hintClassName
  ].filter(Boolean).join(' ');

  // Build aria-describedby
  const describedBy = [
    hint && hintId,
    error && errorId
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={fieldClasses} {...props}>
      {label && (
        <label
          htmlFor={fieldId}
          className={labelClasses}
        >
          {label}
          {required && (
            <span
              className="form-field__required"
              aria-label={ARIA_LABELS.required}
            >
              *
            </span>
          )}
        </label>
      )}
      
      {hint && (
        <div
          id={hintId}
          className={hintClasses}
        >
          {hint}
        </div>
      )}
      
      <div className="form-field__input-wrapper">
        {React.cloneElement(children, {
          id: fieldId,
          'aria-describedby': describedBy,
          'aria-invalid': error ? 'true' : 'false',
          'aria-required': required,
          ref
        })}
      </div>
      
      {error && (
        <div
          id={errorId}
          className={errorClasses}
          role="alert"
          aria-live="polite"
        >
          <span className="form-field__error-icon" aria-hidden="true">⚠</span>
          {error}
        </div>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

// Accessible Input Component
export const AccessibleInput = forwardRef(({
  type = 'text',
  placeholder,
  disabled = false,
  readOnly = false,
  autoComplete,
  className = '',
  ...props
}, ref) => {
  const inputClasses = [
    'accessible-input',
    disabled && 'accessible-input--disabled',
    readOnly && 'accessible-input--readonly',
    className
  ].filter(Boolean).join(' ');

  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      autoComplete={autoComplete}
      className={inputClasses}
      {...props}
    />
  );
});

AccessibleInput.displayName = 'AccessibleInput';

// Accessible Textarea Component
export const AccessibleTextarea = forwardRef(({
  rows = 4,
  placeholder,
  disabled = false,
  readOnly = false,
  resize = 'vertical',
  className = '',
  ...props
}, ref) => {
  const textareaClasses = [
    'accessible-textarea',
    `accessible-textarea--resize-${resize}`,
    disabled && 'accessible-textarea--disabled',
    readOnly && 'accessible-textarea--readonly',
    className
  ].filter(Boolean).join(' ');

  return (
    <textarea
      ref={ref}
      rows={rows}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      className={textareaClasses}
      {...props}
    />
  );
});

AccessibleTextarea.displayName = 'AccessibleTextarea';

// Accessible Select Component
export const AccessibleSelect = forwardRef(({
  options = [],
  placeholder,
  disabled = false,
  multiple = false,
  className = '',
  ...props
}, ref) => {
  const selectClasses = [
    'accessible-select',
    disabled && 'accessible-select--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <select
      ref={ref}
      disabled={disabled}
      multiple={multiple}
      className={selectClasses}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option, index) => (
        <option
          key={option.value || index}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
});

AccessibleSelect.displayName = 'AccessibleSelect';

// Accessible Checkbox Component
export const AccessibleCheckbox = forwardRef(({
  label,
  error,
  hint,
  disabled = false,
  indeterminate = false,
  className = '',
  labelClassName = '',
  ...props
}, ref) => {
  const [fieldId] = useState(() => AriaUtils.generateId('checkbox'));
  const checkboxRef = React.useRef(null);

  // Handle indeterminate state
  React.useEffect(() => {
    const checkbox = ref?.current || checkboxRef.current;
    if (checkbox) {
      checkbox.indeterminate = indeterminate;
    }
  }, [indeterminate, ref]);

  const wrapperClasses = [
    'checkbox-field',
    error && 'checkbox-field--error',
    disabled && 'checkbox-field--disabled',
    className
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'checkbox-field__label',
    labelClassName
  ].filter(Boolean).join(' ');

  return (
    <FormField
      error={error}
      hint={hint}
      className={wrapperClasses}
    >
      <div className="checkbox-field__wrapper">
        <input
          ref={ref || checkboxRef}
          type="checkbox"
          id={fieldId}
          disabled={disabled}
          className="checkbox-field__input"
          {...props}
        />
        <label
          htmlFor={fieldId}
          className={labelClasses}
        >
          <span className="checkbox-field__indicator" aria-hidden="true" />
          <span className="checkbox-field__text">
            {label}
          </span>
        </label>
      </div>
    </FormField>
  );
});

AccessibleCheckbox.displayName = 'AccessibleCheckbox';

// Accessible Radio Group Component
export const AccessibleRadioGroup = forwardRef(({
  name,
  options = [],
  value,
  onChange,
  error,
  hint,
  legend,
  required = false,
  disabled = false,
  orientation = 'vertical',
  className = '',
  ...props
}, ref) => {
  const [groupId] = useState(() => AriaUtils.generateId('radio-group'));

  const groupClasses = [
    'radio-group',
    `radio-group--${orientation}`,
    error && 'radio-group--error',
    disabled && 'radio-group--disabled',
    className
  ].filter(Boolean).join(' ');

  const handleChange = useCallback((event) => {
    if (onChange) {
      onChange(event.target.value, event);
    }
  }, [onChange]);

  return (
    <FormField
      error={error}
      hint={hint}
      className={groupClasses}
      {...props}
    >
      <fieldset className="radio-group__fieldset">
        {legend && (
          <legend className="radio-group__legend">
            {legend}
            {required && (
              <span
                className="form-field__required"
                aria-label={ARIA_LABELS.required}
              >
                *
              </span>
            )}
          </legend>
        )}
        
        <div
          className="radio-group__options"
          role="radiogroup"
          aria-labelledby={legend ? undefined : groupId}
        >
          {options.map((option, index) => {
            const radioId = `${groupId}-${index}`;
            const isChecked = value === option.value;
            
            return (
              <div key={option.value || index} className="radio-option">
                <input
                  type="radio"
                  id={radioId}
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  disabled={disabled || option.disabled}
                  onChange={handleChange}
                  className="radio-option__input"
                />
                <label
                  htmlFor={radioId}
                  className="radio-option__label"
                >
                  <span className="radio-option__indicator" aria-hidden="true" />
                  <span className="radio-option__text">
                    {option.label}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </FormField>
  );
});

AccessibleRadioGroup.displayName = 'AccessibleRadioGroup';