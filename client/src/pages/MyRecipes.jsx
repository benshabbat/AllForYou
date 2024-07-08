import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRecipes } from '../store/slices/recipeSlice'; // נניח שפעולה זו קיימת
import RecipeCard from '../components/RecipeCard';
import styles from './MyRecipes.module.css'; // יש ליצור קובץ CSS מתאים

const MyRecipes = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { recipes, isLoading, error } = useSelector((state) => state.recipes);
  const [userRecipes, setUserRecipes] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserRecipes(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (recipes) {
      setUserRecipes(recipes.filter(recipe => recipe.createdBy === user.id));
    }
  }, [recipes, user]);

  if (isLoading) {
    return <div className={styles.loading}>טוען את המתכונים שלך...</div>;
  }

  if (error) {
    return <div className={styles.error}>שגיאה בטעינת המתכונים: {error}</div>;
  }

  return (
    <div className={styles.myRecipesContainer}>
      <h1 className={styles.title}>המתכונים שלי</h1>
      {userRecipes.length === 0 ? (
        <p className={styles.noRecipes}>עדיין לא הוספת מתכונים. <a href="/add-recipe">הוסף מתכון חדש</a></p>
      ) : (
        <div className={styles.recipeGrid}>
          {userRecipes.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;