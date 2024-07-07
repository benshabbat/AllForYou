import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRecipes } from '../store/slices/recipeSlice';
import Pagination from '../components/Pagination';
import AdvancedSearch from '../components/AdvancedSearch';
import RecipeCard from '../components/RecipeCard';
import styles from './RecipeList.module.css';

// קבוע המגדיר את מספר המתכונים לעמוד
const RECIPES_PER_PAGE = 12;

const RecipeList = () => {
  const dispatch = useDispatch();
  // שליפת נתוני המתכונים מה-Redux store
  const { recipes, totalRecipes, isLoading, error } = useSelector((state) => state.recipes);
  // ניהול מספר העמוד הנוכחי
  const [currentPage, setCurrentPage] = useState(1);
  // ניהול פרמטרי החיפוש
  const [searchParams, setSearchParams] = useState({});

  // פונקציה לטעינת מתכונים, עטופה ב-useCallback למניעת רינדורים מיותרים
  const fetchRecipesData = useCallback(() => {
    dispatch(fetchRecipes({ ...searchParams, page: currentPage, limit: RECIPES_PER_PAGE }));
  }, [dispatch, currentPage, searchParams]);

  // אפקט לטעינת מתכונים בעת טעינת הקומפוננטה או שינוי בפרמטרים
  useEffect(() => {
    fetchRecipesData();
  }, [fetchRecipesData]);

  // טיפול בשינוי עמוד
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // גלילה חלקה לראש העמוד בעת החלפת עמוד
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // טיפול בחיפוש מתקדם
  const handleAdvancedSearch = (newSearchParams) => {
    setSearchParams(newSearchParams);
    setCurrentPage(1); // חזרה לעמוד הראשון בעת ביצוע חיפוש חדש
  };

  // רנדור תוכן הדף בהתאם למצב הנוכחי
  const renderContent = () => {
    if (isLoading) return <div className={styles.loading}>טוען מתכונים...</div>;
    if (error) return <div className={styles.error}>שגיאה: {error}</div>;
    if (!recipes || recipes.length === 0) return <div className={styles.noRecipes}>לא נמצאו מתכונים. נסה לשנות את פרמטרי החיפוש.</div>;

    return (
      <div className={styles.recipeGrid}>
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>המתכונים שלנו</h1>
      <AdvancedSearch onSearch={handleAdvancedSearch} />
      {renderContent()}
      {totalRecipes > RECIPES_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalRecipes / RECIPES_PER_PAGE)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

// שימוש ב-React.memo למניעת רינדורים מיותרים של הקומפוננטה
export default React.memo(RecipeList);