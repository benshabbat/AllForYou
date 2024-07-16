import React from 'react';
import { Controller } from 'react-hook-form';
import AllergenIcon from './AllergenIcon';
import styles from './AllergenSelection.module.css';

const AllergenSelection = ({ name, control, label, error, allergens }) => {
  if (!allergens || allergens.length === 0) {
    return <div>אין אלרגנים זמינים</div>;
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <div className={styles.allergenSelection}>
          <label className={styles.label}>{label}</label>
          <div className={styles.allergenGrid}>
            {allergens.map((allergen) => (
              <label key={allergen._id} className={styles.allergenItem}>
                <input
                  type="checkbox"
                  value={allergen._id}
                  checked={field.value.includes(allergen._id)}
                  onChange={(e) => {
                    const updatedValue = e.target.checked
                      ? [...field.value, allergen._id]
                      : field.value.filter(id => id !== allergen._id);
                    field.onChange(updatedValue);
                  }}
                />
                <AllergenIcon allergen={allergen} />
                <span>{allergen.hebrewName}</span>
              </label>
            ))}
          </div>
          {error && <span className={styles.error}>{error.message}</span>}
        </div>
      )}
    />
  );
};

export default AllergenSelection;