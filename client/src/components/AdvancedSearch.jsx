import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { fetchAllergens, fetchRecipes } from '../store/slices/recipeSlice';
import AllergenFilter from './AllergenFilter';
import { useAllergens } from '../hooks/useAllergens';
import { useSearchForm } from '../hooks/useSearchForm';
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
        <input
          type="text"
          name="keyword"
          value={searchParams.keyword}
          onChange={handleKeywordChange}
          placeholder="חפש מתכונים..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          חפש
        </button>
        <SearchSuggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />
      </div>
      
      <button type="button" onClick={toggleAdvancedOptions} className={styles.advancedOptionsButton}>
        {advancedOptions ? 'הסתר אפשרויות מתקדמות' : 'הצג אפשרויות מתקדמות'}
      </button>
      
      {advancedOptions && (
        <div className={styles.advancedOptions}>
          <div className={styles.optionGroup}>
            <label htmlFor="category">קטגוריה:</label>
            <select
              id="category"
              name="category"
              value={searchParams.category}
              onChange={handleChange}
            >
              <option value="">כל הקטגוריות</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.optionGroup}>
            <label htmlFor="difficulty">רמת קושי:</label>
            <select
              id="difficulty"
              name="difficulty"
              value={searchParams.difficulty}
              onChange={handleChange}
            >
              <option value="">כל רמות הקושי</option>
              {DIFFICULTY_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          
          <AllergenFilter 
            allergens={allergens}
            selectedAllergens={selectedAllergens}
            onFilterChange={handleAllergenChange}
            isLoading={allergensLoading}
            error={allergensError}
          />
          
          <div className={styles.optionGroup}>
            <label>זמן הכנה מקסימלי (בדקות):</label>
            <div className={styles.timeRange}>
              <input
                type="number"
                name="maxPrepTime"
                value={searchParams.maxPrepTime || ''}
                onChange={handleChange}
                min="0"
              />
              <span>דקות</span>
            </div>
          </div>
          
          <div className={styles.optionGroup}>
            <label>קלוריות מקסימליות:</label>
            <div className={styles.calorieRange}>
              <input
                type="number"
                name="maxCalories"
                value={searchParams.maxCalories || ''}
                onChange={handleChange}
                min="0"
              />
              <span>קלוריות</span>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default React.memo(AdvancedSearch);