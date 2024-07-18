import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Skeleton from '../components/Skeleton';
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
    () => api.get('/recipes', { params: { ...filters, page, pageSize } }).then(res => res.data),
    { keepPreviousData: true }
  );

  useEffect(() => {
    refetch();
  }, [filters, page, refetch]);

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setPage(1);
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange({ search: searchTerm });
  };

  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split('-');
    handleFilterChange({ sortBy, order });
  };

  const totalPages = data ? Math.ceil(data.totalRecipes / pageSize) : 0;

  if (isLoading) return (
    <div className={styles.recipeGrid}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={styles.recipeCardSkeleton}>
          <Skeleton type="thumbnail" height="200px" />
          <Skeleton type="title" width="80%" height="24px" />
          <Skeleton type="text" count={3} />
        </div>
      ))}
    </div>
  );
  
  if (error) return <ErrorMessage message="שגיאה בטעינת המתכונים" />;

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>מתכונים</h1>
      <SearchBar onSearch={handleSearch} />
      <div className={styles.content}>
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        <div className={styles.recipesSection}>
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
          <div className={styles.recipeGrid}>
            {data.recipes.length === 0 ? (
              <p className={styles.noRecipes}>לא נמצאו מתכונים התואמים לחיפוש שלך.</p>
            ) : (
              data.recipes.map(recipe => <RecipeCard key={recipe._id} recipe={recipe} />)
            )}
          </div>
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

export default RecipeList;