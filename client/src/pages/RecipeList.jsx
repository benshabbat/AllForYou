import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RECIPES_PER_PAGE } from '../constants';
import RecipeCard from '../components/RecipeCard';
import AllergenFilter from '../components/AllergenFilter';
import AdvancedSearch from '../components/AdvancedSearch';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useRecipeList } from '../hooks/useRecipeList';
import { useAllergens } from '../hooks/useAllergens';
import styles from './RecipeList.module.css';
import { useRecipeFilter } from '../hooks/useRecipeFilter';

const RecipeList = () => {
  const [allergenFilter, setAllergenFilter] = useState([]);
  const { allergens } = useAllergens();
  const {
    recipes,
    hasMore,
    isLoading,
    error,
    handleSearch,
    fetchNextPage,
  } = useRecipeList(RECIPES_PER_PAGE);

  const filteredRecipes = useRecipeFilter(recipes, allergenFilter);

  const observer = useRef();
  const lastRecipeElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, fetchNextPage]);

  const handleFilterChange = useCallback((selectedAllergens) => {
    setAllergenFilter(selectedAllergens);
  }, []);

  const handleSearchWithAllergens = useCallback((searchParams) => {
    handleSearch({ ...searchParams, allergens: allergenFilter });
  }, [handleSearch, allergenFilter]);

  useEffect(() => {
    handleSearch({ allergens: allergenFilter });
  }, [allergenFilter, handleSearch]);

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>Our Recipes</h1>
      <AllergenFilter allergens={allergens} onFilterChange={handleFilterChange} />
      <AdvancedSearch onSearch={handleSearchWithAllergens} />
      {filteredRecipes.length === 0 ? (
        <p className={styles.noRecipes}>No recipes found matching your criteria.</p>
      ) : (
        <RecipeGrid recipes={filteredRecipes} lastRecipeElementRef={lastRecipeElementRef} />
      )}
      {isLoading && <Loading message="Loading more recipes..." />}
    </div>
  );
};

const RecipeGrid = React.memo(({ recipes, lastRecipeElementRef }) => (
  <div className={styles.recipeGrid} role="list" aria-label="Recipe list">
    {recipes.map((recipe, index) => (
      <div key={recipe._id} ref={index === recipes.length - 1 ? lastRecipeElementRef : null} role="listitem">
        <RecipeCard recipe={recipe} />
      </div>
    ))}
  </div>
));

export default React.memo(RecipeList);