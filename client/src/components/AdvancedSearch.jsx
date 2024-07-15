import React from "react";
import { useDispatch } from 'react-redux';
import { fetchAllergens } from '../store/slices/recipeSlice';
import AllergenIcon from './AllergenIcon';
import { useAllergens } from '../hooks/useAllergens';
import { useSearchForm } from '../hooks/useSearchForm';
import SearchInputs from '../components/SearchInputs';
import { CATEGORIES, DIFFICULTY_LEVELS } from '../constants';
import styles from "./AdvancedSearch.module.css";

const AdvancedSearch = ({ onSearch }) => {
  const dispatch = useDispatch();
  const { allergens, allergensLoading, allergensError } = useAllergens();
  const { searchParams, handleChange, handleAllergenToggle, handleSubmit } = useSearchForm(onSearch);

  React.useEffect(() => {
    dispatch(fetchAllergens());
  }, [dispatch]);

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <SearchInputs 
        searchParams={searchParams} 
        handleChange={handleChange} 
        categories={CATEGORIES}
        difficultyLevels={DIFFICULTY_LEVELS}
      />
      <AllergenSelection 
        allergens={allergens} 
        selectedAllergens={searchParams.allergens}
        onAllergenToggle={handleAllergenToggle}
        isLoading={allergensLoading}
        error={allergensError}
      />
      <SearchButton />
    </form>
  );
};



const InputGroup = ({ name, value, onChange, placeholder }) => (
  <div className={styles.inputGroup}>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={styles.input}
    />
  </div>
);

const SelectGroup = ({ name, value, onChange, options }) => (
  <div className={styles.inputGroup}>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={styles.select}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const AllergenSelection = ({ allergens, selectedAllergens, onAllergenToggle, isLoading, error }) => (
  <div className={styles.allergenGroup}>
    <span className={styles.allergenLabel}>סנן אלרגנים:</span>
    <div className={styles.allergenButtons}>
      {isLoading ? (
        <p>טוען אלרגנים...</p>
      ) : error ? (
        <p>שגיאה בטעינת אלרגנים: {error}</p>
      ) : (
        allergens.map((allergen) => (
          <AllergenButton 
            key={allergen._id}
            allergen={allergen}
            isSelected={selectedAllergens.includes(allergen._id)}
            onToggle={() => onAllergenToggle(allergen._id)}
          />
        ))
      )}
    </div>
  </div>
);

const AllergenButton = ({ allergen, isSelected, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`${styles.allergenButton} ${isSelected ? styles.active : ''}`}
  >
    <AllergenIcon allergen={allergen} size="small" />
    <span>{allergen.hebrewName}</span>
  </button>
);

const SearchButton = () => (
  <div className={styles.searchButtonContainer}>
    <button type="submit" className={styles.searchButton}>
      חיפוש
    </button>
  </div>
);

export default React.memo(AdvancedSearch);