import React from 'react';
import { useQuery } from 'react-query';
import { fetchUserRecipes } from '../store/slices/recipeSlice';
import { useSelector } from 'react-redux';
import RecipeCard from '../components/RecipeCard';
import styles from './MyRecipes.module.css';

const MyRecipes = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: userRecipes, isLoading, error } = useQuery(
    ['userRecipes', user?.id],
    () => fetchUserRecipes(user?.id),
    { enabled: !!user?.id }
  );

  if (isLoading) return <div className={styles.loading}>טוען את המתכונים שלך...</div>;
  if (error) return <div className={styles.error}>שגיאה בטעינת המתכונים: {error.message}</div>;
  if (!user) return <div className={styles.error}>משתמש לא מחובר</div>;

  return (
    <div className={styles.myRecipesContainer}>
      <h1 className={styles.title}>המתכונים שלי</h1>
      {userRecipes && userRecipes.length > 0 ? (
        <div className={styles.recipeGrid}>
          {userRecipes.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className={styles.noRecipes}>עדיין לא הוספת מתכונים. <a href="/add-recipe">הוסף מתכון חדש</a></p>
      )}
    </div>
  );
};

export default MyRecipes;