import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import AdvancedSearch from '../components/AdvancedSearch';
import { RootState } from '../store';
import styles from './RecipeList.module.css';

// מספר המתכונים שיוצגו בכל עמוד
const RECIPES_PER_PAGE = 12;

const RecipeList = () => {
  const dispatch = useDispatch();
  // שליפת נתוני המתכונים מה-Redux store
  const { recipes, totalRecipes, isLoading, error } = useSelector((state: RootState) => state.recipes);
  // ניהול מספר העמוד הנוכחי
  const [currentPage, setCurrentPage] = useState(1);
  // ניהול פרמטרי החיפוש
  const [searchParams, setSearchParams] = useState({});

  // אפקט לטעינת מתכונים בעת טעינת הקומפוננטה, שינוי עמוד או שינוי בפרמטרי החיפוש
  useEffect(() => {
    dispatch(fetchRecipes({ ...searchParams, page: currentPage, limit: RECIPES_PER_PAGE }));
  }, [dispatch, currentPage, searchParams]);

  // טיפול בשינוי עמוד
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // גלילה לראש העמוד בעת החלפת עמוד
    window.scrollTo(0, 0);
  };

  // טיפול בחיפוש מתקדם
  const handleAdvancedSearch = (newSearchParams) => {
    setSearchParams(newSearchParams);
    setCurrentPage(1); // חזרה לעמוד הראשון בעת ביצוע חיפוש חדש
  };

  // רנדור תוכן הדף
  const renderContent = () => {
    if (isLoading) {
      return <div className={styles.loading}>טוען מתכונים...</div>;
    }

    if (error) {
      return <div className={styles.error}>שגיאה: {error}</div>;
    }

    if (!recipes || recipes.length === 0) {
      return <p className={styles.noRecipes}>לא נמצאו מתכונים. נסה לשנות את פרמטרי החיפוש.</p>;
    }

    return (
      <>
        <div className={styles.recipeGrid}>
          {recipes.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
        {totalRecipes > RECIPES_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalRecipes / RECIPES_PER_PAGE)}
            onPageChange={handlePageChange}
          />
        )}
      </>
    );
  };

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>מתכונים</h1>
      <AdvancedSearch onSearch={handleAdvancedSearch} />
      {renderContent()}
    </div>
  );
};

export default RecipeList;