import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import { fetchRecipes } from '../../utils/apiUtils';
import RecipeCard from '../../components/recipe/recipeCard/RecipeCard';
import SearchBar from '../../components/searchBar/SearchBar';
import FilterSidebar from '../../components/filterSideBar/FilterSidebar';
import Pagination from '../../components/pagination/Pagination';
import {Loading} from '../../components/common';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
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

  const { data, isLoading, error, refetch } = useQuery(
    ['recipes', filters, page],
    () => fetchRecipes({ ...filters, page, pageSize }),
    { keepPreviousData: true }
  );

  useEffect(() => {
    refetch();
  }, [filters, page, refetch]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setPage(1);
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    handleFilterChange({ search: searchTerm });
  }, [handleFilterChange]);

  const handleSortChange = useCallback((e) => {
    const [sortBy, order] = e.target.value.split('-');
    handleFilterChange({ sortBy, order });
  }, [handleFilterChange]);

  const renderSortDropdown = () => (
    <div className={styles.sortContainer}>
      <label htmlFor="sort" className={styles.sortLabel}>מיין לפי: </label>
      <select
        id="sort"
        value={`${filters.sortBy}-${filters.order}`}
        onChange={handleSortChange}
        className={styles.sortSelect}
      >
        <option value="createdAt-desc">חדש ביותר</option>
        <option value="createdAt-asc">ישן ביותר</option>
        <option value="averageRating-desc">דירוג גבוה</option>
        <option value="averageRating-asc">דירוג נמוך</option>
      </select>
    </div>
  );

  const renderRecipeGrid = () => {
    if (!data || data.recipes.length === 0) {
      return <p className={styles.noRecipes}>לא נמצאו מתכונים התואמים לחיפוש שלך.</p>;
    }

    return (
      <div className={styles.recipeGrid}>
        {data.recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} showActions={false} />
        ))}
      </div>
    );
  };

  if (isLoading) return <Loading message="טוען מתכונים..." />;
  if (error) return <ErrorMessage message="שגיאה בטעינת המתכונים" />;

  const totalPages = data ? Math.ceil(data.totalRecipes / pageSize) : 0;

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>מתכונים</h1>
      <SearchBar onSearch={handleSearch} />
      <div className={styles.content}>
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        <div className={styles.recipesSection}>
          {renderSortDropdown()}
          {renderRecipeGrid()}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(RecipeList);