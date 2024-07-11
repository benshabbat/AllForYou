import React, { useState } from 'react';
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

  const { data, isLoading, error } = useQuery(
    ['recipes', currentPage, searchParams],
    () => fetchRecipes({ page: currentPage, limit: RECIPES_PER_PAGE, ...searchParams }),
    { keepPreviousData: true }
  );

  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) return <Loading message="טוען מתכונים..." />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data || data.recipes.length === 0) return <p className={styles.noRecipes}>לא נמצאו מתכונים.</p>;

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>המתכונים שלנו</h1>
      <AdvancedSearch onSearch={handleSearch} />
      <div className={styles.recipeGrid}>
        {data.recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={Math.ceil(data.totalRecipes / RECIPES_PER_PAGE)}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default React.memo(RecipeList);