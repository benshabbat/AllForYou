import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import RecipeCard from './RecipeCard';
import styles from './RecentRecipes.module.css';

const RecentRecipes = () => {
  const { data, isLoading, error } = useQuery('recentRecipes', () => 
    api.get('/recipes?sort=createdAt&limit=4').then(res => res.data)
  );

  if (isLoading) return <div>טוען מתכונים אחרונים...</div>;
  if (error) return <div>שגיאה בטעינת מתכונים אחרונים: {error.message}</div>;

  // Check if data exists and has the expected structure
  const recipes = data?.recipes || [];

  if (recipes.length === 0) {
    return <div>אין מתכונים אחרונים להצגה.</div>;
  }

  return (
    <section className={styles.recentRecipes}>
      <h2>מתכונים אחרונים</h2>
      <div className={styles.recipeGrid}>
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
      <Link to="/recipes" className={styles.viewAllButton}>צפה בכל המתכונים</Link>
    </section>
  );
};

export default RecentRecipes;