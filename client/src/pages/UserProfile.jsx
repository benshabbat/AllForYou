import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserRecipes } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import styles from './UserProfile.module.css';

function UserProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { recipes } = useSelector((state) => state.recipes);
  const [userRecipes, setUserRecipes] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserRecipes(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    setUserRecipes(recipes.filter(recipe => recipe.createdBy === user.id));
  }, [recipes, user]);

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>הפרופיל שלי</h1>
      <div className={styles.userInfo}>
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>
      <div className={styles.userRecipes}>
        <h3>המתכונים שלי</h3>
        {userRecipes.length > 0 ? (
          <div className={styles.recipeGrid}>
            {userRecipes.map(recipe => (
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