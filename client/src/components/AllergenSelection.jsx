import React from 'react';
import { Controller } from 'react-hook-form';
import AllergenIcon from './AllergenIcon';
import styles from './AllergenSelection.module.css';

const AllergenSelection = ({ name, control, label, error, allergens }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <div className={styles.formGroup}>
        <label>{label}</label>
        <div className={styles.checkboxGroup}>
          {allergens.map((allergen) => (
            <label key={allergen._id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={allergen._id}
                checked={field.value.includes(allergen._id)}
                onChange={(e) => {
                  const updatedAllergens = e.target.checked
                    ? [...field.value, allergen._id]
                    : field.value.filter((id) => id !== allergen._id);
                  field.onChange(updatedAllergens);
                }}
              />
              <AllergenIcon allergen={allergen} size="small" />
              <span>{allergen.hebrewName}</span>
            </label>
          ))}
        </div>
        {error && <span className={styles.error}>{error.message}</span>}
      </div>
    )}
  />
);

export default AllergenSelection;