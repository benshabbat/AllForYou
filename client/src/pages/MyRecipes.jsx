import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRecipes } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import styles from './MyRecipes.module.css';

const MyRecipes = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [userRecipes, setUserRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRecipes = useCallback(async () => {
    if (user?.id) {
      try {
        setIsLoading(true);
        const recipes = await dispatch(fetchUserRecipes(user.id)).unwrap();
        setUserRecipes(recipes);
      } catch (err) {
        setError(err.message || 'שגיאה בטעינת המתכונים');
      } finally {
        setIsLoading(false);
      }
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  if (isLoading) return <Loading message="טוען את המתכונים שלך..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="משתמש לא מחובר" />;

  const renderRecipes = () => (
    <div className={styles.recipeGrid}>
      {userRecipes.map(recipe => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );

  return (
    <div className={styles.myRecipesContainer}>
      <h1 className={styles.title}>המתכונים שלי</h1>
      {userRecipes && userRecipes.length > 0 ? renderRecipes() : (
        <p className={styles.noRecipes}>עדיין לא הוספת מתכונים. <a href="/add-recipe">הוסף מתכון חדש</a></p>
      )}
    </div>
  );
};

export default React.memo(MyRecipes);