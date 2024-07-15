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
        <label className={styles.label}>{label}</label>
        <div className={styles.allergenGrid}>
          {allergens.map((allergen) => (
            <button
              key={allergen._id}
              type="button"
              className={`${styles.allergenButton} ${field.value.includes(allergen._id) ? styles.selected : ''}`}
              onClick={() => {
                const updatedAllergens = field.value.includes(allergen._id)
                  ? field.value.filter(id => id !== allergen._id)
                  : [...field.value, allergen._id];
                field.onChange(updatedAllergens);
              }}
            >
              <AllergenIcon allergen={allergen} size="small" />
              <span className={styles.allergenName}>{allergen.hebrewName}</span>
            </button>
          ))}
        </div>
        {error && <span className={styles.error}>{error.message}</span>}
      </div>
    )}
  />
);

export default AllergenSelection;