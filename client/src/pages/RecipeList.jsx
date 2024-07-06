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

  // אפקט לטעינת מתכונים בעת טעינת הקומפוננטה או שינוי עמוד
  useEffect(() => {
    dispatch(fetchRecipes({ page: currentPage, limit: RECIPES_PER_PAGE }));
  }, [dispatch, currentPage]);

  // טיפול בשינוי עמוד
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // גלילה לראש העמוד בעת החלפת עמוד
    window.scrollTo(0, 0);
  };

  // טיפול בחיפוש מתקדם
  const handleAdvancedSearch = (searchParams) => {
    dispatch(fetchRecipes({ ...searchParams, page: 1, limit: RECIPES_PER_PAGE }));
    // איפוס מספר העמוד לאחר חיפוש חדש
    setCurrentPage(1);
  };

  // הצגת מסך טעינה
  if (isLoading) return <div className={styles.loading}>טוען מתכונים...</div>;
  
  // הצגת הודעת שגיאה
  if (error) return <div className={styles.error}>שגיאה: {error}</div>;

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>מתכונים</h1>
      
      {/* קומפוננטת חיפוש מתקדם */}
      <AdvancedSearch onSearch={handleAdvancedSearch} />

      {/* הצגת רשימת המתכונים או הודעה אם אין מתכונים */}
      {recipes && recipes.length > 0 ? (
        <div className={styles.recipeGrid}>
          {recipes.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className={styles.noRecipes}>לא נמצאו מתכונים. נסה לשנות את פרמטרי החיפוש.</p>
      )}

      {/* הצגת קומפוננטת העימוד רק אם יש יותר מתכונים ממה שניתן להציג בעמוד אחד */}
      {totalRecipes && totalRecipes > RECIPES_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalRecipes / RECIPES_PER_PAGE)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default RecipeList;