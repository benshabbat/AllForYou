import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import AdvancedSearch from '../components/AdvancedSearch';
import styles from './RecipeList.module.css';

function RecipeList() {
  const dispatch = useDispatch();
  const { recipes, totalRecipes, isLoading, error } = useSelector((state) => state.recipes);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 12;

  useEffect(() => {
    // טעינת מתכונים בעת טעינת הקומפוננטה או שינוי עמוד
    dispatch(fetchRecipes({ page: currentPage, limit: recipesPerPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) return <div className={styles.loading}>טוען מתכונים...</div>;
  if (error) return <div className={styles.error}>שגיאה: {error}</div>;

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>מתכונים</h1>
      
      {/* קומפוננטת חיפוש מתקדם */}
      <AdvancedSearch />

      {/* רשימת המתכונים */}
      <div className={styles.recipeGrid}>
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>

      {/* קומפוננטת עימוד */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalRecipes / recipesPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default RecipeList;