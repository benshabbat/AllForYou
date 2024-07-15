import React, { useState, useEffect } from 'react';
import { RECIPES_PER_PAGE } from '../constants';
import RecipeCard from '../components/RecipeCard';
import AllergenFilter from '../components/AllergenFilter';
import AdvancedSearch from '../components/AdvancedSearch';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useRecipeList } from '../hooks/useRecipeList';
import { useAllergens } from '../hooks/useAllergens';
import styles from './RecipeList.module.css';


const RecipeList = () => {
  const [allergenFilter, setAllergenFilter] = useState([]);
  const { allergens } = useAllergens();
  const {
    recipes,
    totalRecipes,
    currentPage,
    isLoading,
    error,
    handleSearch,
    handlePageChange,
  } = useRecipeList(RECIPES_PER_PAGE);

  const filteredRecipes = recipes.filter(recipe => 
    allergenFilter.length === 0 || 
    !recipe.allergens.some(allergen => allergenFilter.includes(allergen._id))
  );

  const handleFilterChange = (selectedAllergens) => {
    setAllergenFilter(selectedAllergens);
  };

  const handleSearchWithAllergens = (searchParams) => {
    handleSearch({ ...searchParams, allergens: allergenFilter });
  };

  useEffect(() => {
    handleSearch({ allergens: allergenFilter });
  }, [allergenFilter]);

  if (isLoading) return <Loading message="Loading recipes..." />;
  if (error) return <ErrorMessage message={error} />;

  const totalPages = Math.ceil(totalRecipes / RECIPES_PER_PAGE);

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>Our Recipes</h1>
      <AllergenFilter allergens={allergens} onFilterChange={handleFilterChange} />
      <AdvancedSearch onSearch={handleSearchWithAllergens} />
      {filteredRecipes.length === 0 ? (
        <p className={styles.noRecipes}>No recipes found matching your criteria.</p>
      ) : (
        <>
          <RecipeGrid recipes={filteredRecipes} />
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

const RecipeGrid = ({ recipes }) => (
  <div className={styles.recipeGrid} role="list" aria-label="Recipe list">
    {recipes.map((recipe) => (
      <div key={recipe._id} role="listitem">
        <RecipeCard recipe={recipe} />
      </div>
    ))}
  </div>
);

export default React.memo(RecipeList);