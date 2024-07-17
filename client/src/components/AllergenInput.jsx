import React from 'react';
import { Controller } from 'react-hook-form';
import styles from './AllergenInput.module.css';

const AllergenInput = ({ control, index, allergens, onRemove }) => {
  return (
    <div className={styles.allergenInputRow}>
      <Controller
        name={`alternatives.${index}.allergen`}
        control={control}
        render={({ field }) => (
          <select {...field}>
            <option value="">בחר אלרגן</option>
            {allergens.map(allergen => (
              <option key={allergen._id} value={allergen._id}>
                {allergen.hebrewName}
              </option>
            ))}
          </select>
        )}
      />
      <Controller
        name={`alternatives.${index}.substitute`}
        control={control}
        render={({ field }) => (
          <input {...field} placeholder="הזן תחליף" />
        )}
      />
      <button type="button" onClick={() => onRemove(index)}>
        הסר
      </button>
    </div>
  );
};

export default AllergenInput;