import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RECIPES_PER_PAGE } from '../constants';
import RecipeCard from '../components/RecipeCard';
import AdvancedSearch from '../components/AdvancedSearch';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useRecipeList } from '../hooks/useRecipeList';
import { useAllergens } from '../hooks/useAllergens';
import styles from './RecipeList.module.css';

const RecipeList = () => {
  const [searchParams, setSearchParams] = useState({});
  const { allergens } = useAllergens();
  const { user } = useSelector(state => state.auth);
  const {
    recipes,
    totalRecipes,
    currentPage,
    isLoading,
    error,
    fetchRecipes,
    setCurrentPage
  } = useRecipeList(RECIPES_PER_PAGE);

  useEffect(() => {
    fetchRecipes(searchParams);
  }, [fetchRecipes, searchParams]);

  const handleSearch = useCallback((params) => {
    setSearchParams(params);
    setCurrentPage(1);
  }, [setCurrentPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  if (isLoading) return <Loading message="טוען מתכונים..." />;
  if (error) return <ErrorMessage message={error} />;

  const totalPages = Math.ceil(totalRecipes / RECIPES_PER_PAGE);

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>המתכונים שלנו</h1>
      <AdvancedSearch onSearch={handleSearch} allergens={allergens} />
      {recipes.length === 0 ? (
        <p className={styles.noRecipes}>לא נמצאו מתכונים התואמים לחיפוש שלך.</p>
      ) : (
        <>
          <p className={styles.resultSummary}>נמצאו {totalRecipes} מתכונים</p>
          <RecipeGrid recipes={recipes} currentUserId={user?.id} />
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

const RecipeGrid = React.memo(({ recipes, currentUserId }) => (
  <div className={styles.recipeGrid} role="list" aria-label="רשימת מתכונים">
    {recipes.map((recipe) => (
      <RecipeCard 
        key={recipe._id}
        recipe={recipe} 
        isOwner={recipe.createdBy === currentUserId}
      />
    ))}
  </div>
));

export default React.memo(RecipeList);