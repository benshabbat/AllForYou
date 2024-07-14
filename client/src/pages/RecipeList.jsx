import React from 'react';
import RecipeCard from '../components/RecipeCard';
import AdvancedSearch from '../components/AdvancedSearch';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useRecipeList } from '../hooks/useRecipeList';
import styles from './RecipeList.module.css';

const RECIPES_PER_PAGE = 12;

const RecipeList = () => {
  const {
    recipes,
    totalRecipes,
    currentPage,
    isLoading,
    error,
    handleSearch,
    handlePageChange,
  } = useRecipeList(RECIPES_PER_PAGE);

  if (isLoading) return <Loading message="טוען מתכונים..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>המתכונים שלנו</h1>
      <AdvancedSearch onSearch={handleSearch} />
      {recipes.length === 0 ? (
        <p className={styles.noRecipes}>לא נמצאו מתכונים.</p>
      ) : (
        <>
          <div className={styles.recipeGrid} role="list" aria-label="רשימת מתכונים">
            {recipes.map((recipe) => (
              <div key={recipe._id} role="listitem">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
          <Pagination 
            currentPage={currentPage}
            totalPages={Math.ceil(totalRecipes / RECIPES_PER_PAGE)}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(RecipeList);