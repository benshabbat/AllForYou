import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserRecipes } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import styles from './MyRecipes.module.css';

const MyRecipes = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userRecipes, isLoading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserRecipes(user.id));
    }
  }, [dispatch, user?.id]);

  if (isLoading) return <Loading message="טוען את המתכונים שלך..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="משתמש לא מחובר" />;

  return (
    <div className={styles.myRecipesContainer}>
      <h1 className={styles.title}>המתכונים שלי</h1>
      {userRecipes.length > 0 ? (
        <div className={styles.recipeGrid}>
          {userRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} isOwner={true} />
          ))}
        </div>
      ) : (
        <div className={styles.noRecipes}>
          <p>עדיין לא הוספת מתכונים.</p>
          <Link to="/add-recipe" className={styles.addRecipeLink}>הוסף מתכון חדש</Link>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;