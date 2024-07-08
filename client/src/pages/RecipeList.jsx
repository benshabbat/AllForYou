import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipeSlice';
import Pagination from '../components/Pagination';
import AdvancedSearch from '../components/AdvancedSearch';
import RecipeCard from '../components/RecipeCard';
import styles from './RecipeList.module.css';

const RECIPES_PER_PAGE = 12;

const RecipeList = () => {
  const dispatch = useDispatch();
  const { recipes, totalRecipes, isLoading, error } = useSelector((state) => state.recipes);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({});

  const fetchRecipesData = useCallback(() => {
    console.log('Fetching recipes with:', { ...searchParams, page: currentPage, limit: RECIPES_PER_PAGE });
    dispatch(fetchRecipes({ ...searchParams, page: currentPage, limit: RECIPES_PER_PAGE }));
  }, [dispatch, currentPage, searchParams]);

  useEffect(() => {
    fetchRecipesData();
  }, [fetchRecipesData]);

  useEffect(() => {
    console.log('Recipes in RecipeList:', recipes);
    console.log('Total recipes:', totalRecipes);
    console.log('Current page:', currentPage);
    console.log('Search params:', searchParams);
  }, [recipes, totalRecipes, currentPage, searchParams]);

  const handlePageChange = (pageNumber) => {
    console.log('Changing to page:', pageNumber);
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdvancedSearch = (newSearchParams) => {
    console.log('New search params:', newSearchParams);
    setSearchParams(newSearchParams);
    setCurrentPage(1);
  };

  if (isLoading) return <div className={styles.loading}>טוען מתכונים...</div>;
  if (error) return <div className={styles.error}>שגיאה: {error}</div>;
  if (!recipes || recipes.length === 0) return <div className={styles.noRecipes}>לא נמצאו מתכונים. נסה לשנות את פרמטרי החיפוש.</div>;

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>המתכונים שלנו</h1>
      <AdvancedSearch onSearch={handleAdvancedSearch} />
      <div className={styles.recipeGrid}>
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
      {totalRecipes > RECIPES_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalRecipes / RECIPES_PER_PAGE)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default React.memo(RecipeList);