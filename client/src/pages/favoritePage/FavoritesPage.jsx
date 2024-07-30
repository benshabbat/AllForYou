import React from 'react';
import { useQuery } from 'react-query';
import { fetchFavoriteRecipes } from '../../utils/apiUtils';
import RecipeCard from '../../components/recipe/recipeCard/RecipeCard';
import {Loading} from '../../components/common';
import ErrorMessage from '../../components/ErrorMessage';
import styles from './FavoritesPage.module.css';

const FavoritesPage = () => {
  const { data: favorites, isLoading, error } = useQuery('favoriteRecipes', fetchFavoriteRecipes);

  if (isLoading) return <Loading message="טוען מתכונים מועדפים..." />;
  if (error) return <ErrorMessage message={`שגיאה בטעינת מתכונים מועדפים: ${error.message}`} />;

  if (favorites.length === 0) {
    return (
      <div className={styles.noFavorites}>
        <h2>אין לך מתכונים מועדפים עדיין.</h2>
        <p>כשתסמן מתכונים כמועדפים, הם יופיעו כאן.</p>
      </div>
    );
  }

  return (
    <div className={styles.favoritesContainer}>
      <h1 className={styles.title}>המתכונים המועדפים שלי</h1>
      <div className={styles.recipeGrid}>
        {favorites.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;