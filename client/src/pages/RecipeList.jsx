import React, { useState, useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { fetchRecipes } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import AdvancedSearch from '../components/AdvancedSearch';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import styles from './RecipeList.module.css';

const RECIPES_PER_PAGE = 12;

function RecipeList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({});

  const fetchRecipesQuery = useCallback((page, params) => {
    return fetchRecipes({ page, limit: RECIPES_PER_PAGE, ...params });
  }, []);

  const { data, isLoading, error } = useQuery(
    ['recipes', currentPage, searchParams],
    () => fetchRecipesQuery(currentPage, searchParams),
    { keepPreviousData: true }
  );

  const handleSearch = useCallback((params) => {
    setSearchParams(params);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const recipes = useMemo(() => data?.recipes || [], [data]);
  const totalRecipes = useMemo(() => data?.totalRecipes || 0, [data]);

  const recipeCards = useMemo(() => (
    recipes.map((recipe) => (
      <RecipeCard key={recipe._id} recipe={recipe} />
    ))
  ), [recipes]);

  if (isLoading) return <Loading message="טוען מתכונים..." />;
  if (error) return <ErrorMessage message={error.message || 'שגיאה בטעינת המתכונים'} />;

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>המתכונים שלנו</h1>
      <AdvancedSearch onSearch={handleSearch} />
      {recipes.length === 0 ? (
        <p className={styles.noRecipes}>לא נמצאו מתכונים.</p>
      ) : (
        <>
          <div className={styles.recipeGrid}>{recipeCards}</div>
          <Pagination 
            currentPage={currentPage}
            totalPages={Math.ceil(totalRecipes / RECIPES_PER_PAGE)}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default React.memo(RecipeList);