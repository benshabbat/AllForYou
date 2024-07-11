import React from 'react';
import { useQuery } from 'react-query';
import { fetchUserRecipes } from '../store/slices/recipeSlice';
import { useSelector } from 'react-redux';
import RecipeCard from '../components/RecipeCard';
import Loading from '../components/Loading'; // יש להוסיף ייבוא זה
import ErrorMessage from '../components/ErrorMessage'; // יש להוסיף ייבוא זה
import styles from './MyRecipes.module.css';

const MyRecipes = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: userRecipes, isLoading, error } = useQuery(
    ['userRecipes', user?.id],
    () => fetchUserRecipes(user?.id),
    { enabled: !!user?.id }
  );

  if (isLoading) return <Loading message="טוען את המתכונים שלך..." />;
  if (error) return <ErrorMessage message={`שגיאה בטעינת המתכונים: ${error.message}`} />;
  if (!user) return <ErrorMessage message="משתמש לא מחובר" />;

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