import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { fetchAllergens, fetchRecipes } from '../store/slices/recipeSlice';
import AllergenFilter from './AllergenFilter';
import { useAllergens } from '../hooks/useAllergens';
import { useSearchForm } from '../hooks/useSearchForm';
import SearchInputs from './SearchInputs';
import SearchSuggestions from './SearchSuggestions';
import { CATEGORIES, DIFFICULTY_LEVELS } from '../constants';
import styles from "./AdvancedSearch.module.css";
import api from '../services/api';

const AdvancedSearch = () => {
  const dispatch = useDispatch();
  const { allergens, isLoading: allergensLoading, error: allergensError } = useAllergens();
  const { searchParams, handleChange, handleSubmit } = useSearchForm();
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    dispatch(fetchAllergens());
  }, [dispatch]);

  const handleAllergenChange = useCallback((allergenIds) => {
    setSelectedAllergens(allergenIds);
  }, []);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    dispatch(fetchRecipes({ ...searchParams, allergens: selectedAllergens }));
  }, [dispatch, searchParams, selectedAllergens]);

  const toggleAdvancedOptions = () => setAdvancedOptions(!advancedOptions);

  const handleKeywordChange = async (e) => {
    const { value } = e.target;
    handleChange(e);
    if (value.length > 2) {
      try {
        const response = await api.get(`/recipes/suggestions?keyword=${value}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleChange({ target: { name: 'keyword', value: suggestion } });
    setSuggestions([]);
  };

  return (
    <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
      <div className={styles.searchInputWrapper}>
        <SearchInputs 
          searchParams={searchParams} 
          handleChange={handleKeywordChange} 
          categories={CATEGORIES}
          difficultyLevels={DIFFICULTY_LEVELS}
        />
        <SearchSuggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />
      </div>
      <button type="button" onClick={toggleAdvancedOptions} className={styles.advancedOptionsButton}>
        {advancedOptions ? 'הסתר אפשרויות מתקדמות' : 'הצג אפשרויות מתקדמות'}
      </button>
      {advancedOptions && (
        <div className={styles.advancedOptions}>
          <AllergenFilter 
            allergens={allergens}
            selectedAllergens={selectedAllergens}
            onFilterChange={handleAllergenChange}
            isLoading={allergensLoading}
            error={allergensError}
          />
          <div className={styles.timeRange}>
            <label>
              זמן הכנה מקסימלי (בדקות):
              <input
                type="number"
                name="maxPrepTime"
                value={searchParams.maxPrepTime || ''}
                onChange={handleChange}
                min="0"
              />
            </label>
          </div>
          <div className={styles.calorieRange}>
            <label>
              קלוריות מקסימליות:
              <input
                type="number"
                name="maxCalories"
                value={searchParams.maxCalories || ''}
                onChange={handleChange}
                min="0"
              />
            </label>
          </div>
        </div>
      )}
      <div className={styles.searchButtonContainer}>
        <button type="submit" className={styles.searchButton}>
          חיפוש
        </button>
      </div>
    </form>
  );
};

export default React.memo(AdvancedSearch);