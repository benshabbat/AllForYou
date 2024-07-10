import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import AdvancedSearch from '../components/AdvancedSearch';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import styles from './RecipeList.module.css';

const RECIPES_PER_PAGE = 12;

function RecipeList() {
  const dispatch = useDispatch();
  const { recipes, isLoading, error, totalRecipes } = useSelector((state) => state.recipes);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({});

  const fetchRecipesData = useCallback(() => {
    dispatch(fetchRecipes({ 
      page: currentPage, 
      limit: RECIPES_PER_PAGE, 
      ...searchParams 
    }));
  }, [dispatch, currentPage, searchParams]);

  useEffect(() => {
    fetchRecipesData();
  }, [fetchRecipesData]);

  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) return <Loading message="טוען מתכונים..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!recipes || recipes.length === 0) return <p className={styles.noRecipes}>לא נמצאו מתכונים.</p>;

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>המתכונים שלנו</h1>
      <AdvancedSearch onSearch={handleSearch} />
      <div className={styles.recipeGrid}>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={Math.ceil(totalRecipes / RECIPES_PER_PAGE)}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default React.memo(RecipeList);