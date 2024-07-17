import React from 'react';
import { Controller } from 'react-hook-form';
import styles from './FormField.module.css';

const FormField = ({ name, control, label, error, as = "input", options = [], ...rest }) => {
  const renderField = ({ field }) => {
    switch (as) {
      case "textarea":
        return <textarea {...field} {...rest} className={styles.textarea} />;
      case "select":
        return (
          <select {...field} {...rest} className={styles.select}>
            <option value="">בחר</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return <input {...field} {...rest} className={styles.input} />;
    }
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={name} className={styles.label}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={renderField}
      />
      {error && <span className={styles.error}>{error.message}</span>}
    </div>
  );
};

export default FormField;