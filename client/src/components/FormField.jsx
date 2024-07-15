import React from 'react';
import { Controller } from 'react-hook-form';
import styles from './FormField.module.css';

const FormField = ({ name, control, label, error, as = "input", options = [], ...rest }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <div className={styles.formGroup}>
        <label htmlFor={name}>{label}</label>
        {as === "textarea" ? (
          <textarea {...field} id={name} {...rest} />
        ) : as === "select" ? (
          <select {...field} id={name} {...rest}>
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : (
          <input {...field} id={name} {...rest} />
        )}
        {error && <span className={styles.error}>{error.message}</span>}
      </div>
    )}
  />
);

export default FormField;