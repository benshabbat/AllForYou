import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFavorites } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import styles from './FavoritesPage.module.css';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { favorites, isLoading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (isLoading) return <div className={styles.loading}>טוען מועדפים...</div>;
  if (error) return <div className={styles.error}>שגיאה: {error}</div>;
  if (favorites.length === 0) return <div className={styles.noFavorites}>אין לך מתכונים מועדפים עדיין.</div>;

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