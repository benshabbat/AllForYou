import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRecipes, setCurrentPage } from '../store/slices/recipeSlice';
import RecipeFilter from '../components/RecipeFilter';
import Pagination from '../components/Pagination';
import styles from './RecipeList.module.css';

const RECIPES_PER_PAGE = 10;

function RecipeList() {
  const dispatch = useDispatch();
  const { recipes, isLoading, error, totalRecipes, currentPage } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipes({ page: currentPage, limit: RECIPES_PER_PAGE }));
  }, [dispatch, currentPage]);

  const handlePageChange = (pageNumber) => {
    dispatch(setCurrentPage(pageNumber));
  };

  if (isLoading) return <div aria-live="polite" className={styles.loading}>טוען מתכונים...</div>;
  if (error) return <div aria-live="assertive" className={styles.error}>שגיאה: {error}</div>;

  const totalPages = Math.ceil(totalRecipes / RECIPES_PER_PAGE);

  return (
    <div className={styles.recipeListContainer}>
      <h2 className={styles.pageTitle}>רשימת מתכונים</h2>
      <RecipeFilter />
      <ul className={styles.recipeList} aria-label="רשימת מתכונים">
        {recipes?.map(recipe => (
          <li key={recipe._id} className={styles.recipeCard}>
            <h3 className={styles.recipeTitle}>{recipe.name}</h3>
            <p className={styles.recipeDescription}>{recipe.ingredients.slice(0, 100)}...</p>
            <p className={styles.recipeAllergens}>
              אלרגנים: {recipe.allergens.join(', ')}
            </p>
            <Link to={`/recipes/${recipe._id}`} className={styles.viewRecipeButton} aria-label={`צפה במתכון ${recipe.name}`}>
              צפה במתכון
            </Link>
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default RecipeList;