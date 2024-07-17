import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRecipes } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import styles from './MyRecipes.module.css';

const MyRecipes = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userRecipes, isLoading, error } = useSelector((state) => state.recipes);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserRecipes(user.id));
    }
  }, [dispatch, user?.id]);

  const sortedRecipes = [...userRecipes].sort((a, b) => {
    if (sortBy === 'createdAt') {
      return sortOrder === 'desc' ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'name') {
      return sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
    }
    return 0;
  });

  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  if (isLoading) return <Loading message="טוען את המתכונים שלך..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={styles.myRecipesContainer}>
      <h1 className={styles.title}>המתכונים שלי</h1>
      <Link to="/add-recipe" className={styles.addRecipeButton}>
        הוסף מתכון חדש
      </Link>
      {userRecipes.length > 0 ? (
        <>
          <div className={styles.sortContainer}>
            <label htmlFor="sort" className={styles.sortLabel}>מיין לפי: </label>
            <select
              id="sort"
              value={`${sortBy}-${sortOrder}`}
              onChange={handleSortChange}
              className={styles.sortSelect}
            >
              <option value="createdAt-desc">חדש ביותר</option>
              <option value="createdAt-asc">ישן ביותר</option>
              <option value="name-asc">שם (א-ת)</option>
              <option value="name-desc">שם (ת-א)</option>
            </select>
          </div>
          <div className={styles.recipeGrid}>
            {sortedRecipes.map(recipe => (
              <RecipeCard key={recipe._id} recipe={recipe} isOwner={true} />
            ))}
          </div>
        </>
      ) : (
        <p className={styles.noRecipes}>
          עדיין לא הוספת מתכונים. <Link to="/add-recipe">הוסף את המתכון הראשון שלך!</Link>
        </p>
      )}
    </div>
  );
};

export default MyRecipes;