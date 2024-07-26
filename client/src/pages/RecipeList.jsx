import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import styles from './RecipeList.module.css';

const RecipeList = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    allergens: [],
    difficulty: '',
    sortBy: 'createdAt',
    order: 'desc'
  });
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data: recipesData, isLoading: recipesLoading, error: recipesError } = useQuery(
    ['recipes', filters, page],
    () => api.getRecipes({ ...filters, page, pageSize }),
    { keepPreviousData: true }
  );

  const { data: allergens = [], isLoading: allergensLoading, error: allergensError } = useQuery('allergens', api.getAllergens);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setPage(1);
  }, []);

  if (recipesLoading || allergensLoading) return <Loading message="טוען מתכונים..." />;
  if (recipesError) return <ErrorMessage message={recipesError.message} />;
  if (allergensError) return <ErrorMessage message={allergensError.message} />;

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>מתכונים</h1>
      <div className={styles.content}>
        <FilterSidebar
          allergens={allergens}
          selectedAllergens={filters.allergens}
          onFilterChange={handleFilterChange}
        />
        <div className={styles.recipesSection}>
          {recipesData?.recipes.length > 0 ? (
            <div className={styles.recipeGrid}>
              {recipesData.recipes.map(recipe => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <p className={styles.noRecipes}>לא נמצאו מתכונים התואמים לחיפוש שלך.</p>
          )}
          {recipesData?.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={recipesData.totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeList;