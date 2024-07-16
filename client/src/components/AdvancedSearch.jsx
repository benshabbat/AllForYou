import React, { useState, useCallback } from "react";
import { useDispatch } from 'react-redux';
import { fetchAllergens } from '../store/slices/recipeSlice';
import AllergenFilter from './AllergenFilter';
import { useAllergens } from '../hooks/useAllergens';
import { useSearchForm } from '../hooks/useSearchForm';
import SearchInputs from './SearchInputs';
import { CATEGORIES, DIFFICULTY_LEVELS } from '../constants';
import styles from "./AdvancedSearch.module.css";

const AdvancedSearch = ({ onSearch }) => {
  const dispatch = useDispatch();
  const { allergens, isLoading: allergensLoading, error: allergensError } = useAllergens();
  const { searchParams, handleChange, handleSubmit } = useSearchForm(onSearch);
  const [selectedAllergens, setSelectedAllergens] = useState([]);

  React.useEffect(() => {
    dispatch(fetchAllergens());
  }, [dispatch]);

  const handleAllergenChange = useCallback((allergenIds) => {
    setSelectedAllergens(allergenIds);
  }, []);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    handleSubmit({ ...searchParams, allergens: selectedAllergens });
  }, [handleSubmit, searchParams, selectedAllergens]);

  return (
    <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
      <SearchInputs 
        searchParams={searchParams} 
        handleChange={handleChange} 
        categories={CATEGORIES}
        difficultyLevels={DIFFICULTY_LEVELS}
      />
      <AllergenFilter 
        allergens={allergens}
        selectedAllergens={selectedAllergens}
        onFilterChange={handleAllergenChange}
        isLoading={allergensLoading}
        error={allergensError}
      />
      <div className={styles.searchButtonContainer}>
        <button type="submit" className={styles.searchButton}>
          חיפוש
        </button>
      </div>
    </form>
  );
};

export default React.memo(AdvancedSearch);