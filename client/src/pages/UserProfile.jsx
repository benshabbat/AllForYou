import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserRecipes } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import styles from './UserProfile.module.css';

function UserProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { recipes, isLoading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    // טעינת המתכונים של המשתמש בעת טעינת הדף
    if (user) {
      dispatch(fetchUserRecipes(user.id));
    }
  }, [dispatch, user]);

  if (isLoading) return <div className={styles.loading}>טוען פרופיל...</div>;
  if (error) return <div className={styles.error}>שגיאה: {error}</div>;
  if (!user) return <div className={styles.error}>משתמש לא מחובר</div>;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>הפרופיל שלי</h1>
      
      {/* מידע על המשתמש */}
      <div className={styles.userInfo}>
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>

      {/* רשימת המתכונים של המשתמש */}
      <div className={styles.userRecipes}>
        <h3>המתכונים שלי</h3>
        {recipes.length > 0 ? (
          <div className={styles.recipeGrid}>
            {recipes.map(recipe => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p>עדיין לא הוספת מתכונים.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;