import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRecipes } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import styles from './MyRecipes.module.css';

const MyRecipes = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userRecipes, isLoading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    if (user && user.id) {
      console.log('Fetching user recipes for user:', user.id);
      dispatch(fetchUserRecipes(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    console.log('Current userRecipes:', userRecipes);
  }, [userRecipes]);

  if (!user) {
    return <div className={styles.loading}>טוען פרטי משתמש...</div>;
  }

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
          {userRecipes.map(recipe => {
            console.log('Rendering recipe:', recipe);
            return <RecipeCard key={recipe._id} recipe={recipe} />;
          })}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;