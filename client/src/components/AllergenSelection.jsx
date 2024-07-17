import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import styles from './AllergenSelection.module.css';

const AllergenSelection = ({ name, control, label, error, allergens }) => {
  const [selectedAllergen, setSelectedAllergen] = useState(null);

  return (
    <div className={styles.allergenSelection}>
      <label className={styles.label}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={styles.allergenGrid}>
            {allergens.map((allergen) => (
              <div key={allergen._id} className={styles.allergenItem}>
                <label>
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
                  <span>{allergen.hebrewName}</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => setSelectedAllergen(allergen)}
                  className={styles.infoButton}
                >
                  מידע
                </button>
              </div>
            ))}
          </div>
        )}
      />
      {error && <span className={styles.error}>{error.message}</span>}
      {selectedAllergen && (
        <div className={styles.allergenInfo}>
          <h4>{selectedAllergen.hebrewName}</h4>
          <p>{selectedAllergen.description}</p>
          <h5>תחליפים מומלצים:</h5>
          <ul>
            {selectedAllergen.alternatives.map((alt, index) => (
              <li key={index}>
                <strong>{alt.name}</strong>: {alt.description}
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedAllergen(null)}>סגור</button>
        </div>
      )}
    </div>
  );
};

export default AllergenSelection;