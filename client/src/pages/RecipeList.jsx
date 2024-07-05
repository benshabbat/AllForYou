import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import styles from './RecipeList.module.css';

function RecipeList() {
  const dispatch = useDispatch();
  const { recipes, totalRecipes, isLoading } = useSelector((state) => state.recipes);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 12;

  useEffect(() => {
    dispatch(fetchRecipes({ page: currentPage, limit: recipesPerPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) return <div>טוען מתכונים...</div>;

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>מתכונים</h1>
      <div className={styles.recipeGrid}>
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalRecipes / recipesPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default RecipeList;