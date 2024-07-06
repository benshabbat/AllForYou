import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRecipes } from '../store/slices/recipeSlice';
import Pagination from '../components/Pagination';
import AdvancedSearch from '../components/AdvancedSearch';
import styles from './RecipeList.module.css';

// מספר המתכונים שיוצגו בכל עמוד
const RECIPES_PER_PAGE = 12;

const RecipeList = () => {
  const dispatch = useDispatch();
  // שליפת נתוני המתכונים מה-Redux store
  const { recipes, totalRecipes, isLoading, error } = useSelector((state) => state.recipes);
  // ניהול מספר העמוד הנוכחי
  const [currentPage, setCurrentPage] = useState(1);
  // ניהול פרמטרי החיפוש
  const [searchParams, setSearchParams] = useState({});

  // אפקט לטעינת מתכונים בעת טעינת הקומפוננטה, שינוי עמוד או שינוי בפרמטרי החיפוש
  useEffect(() => {
    dispatch(fetchRecipes({ ...searchParams, page: currentPage, limit: RECIPES_PER_PAGE }));
  }, [dispatch, currentPage, searchParams]);

  // טיפול בשינוי עמוד
  const handlePageChange = (pageNumber) => {
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
    if (isLoading) return <div className={styles.loading}>טוען מתכונים...</div>;
    if (error) return <div className={styles.error}>שגיאה: {error}</div>;
    if (!recipes || recipes.length === 0) return <div className={styles.noRecipes}>לא נמצאו מתכונים. נסה לשנות את פרמטרי החיפוש.</div>;

    return (
      <div className={styles.recipeGrid}>
        {recipes.map(recipe => (
          <div key={recipe._id} className={styles.recipeCard}>
            {recipe.image && <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} />}
            <div className={styles.recipeContent}>
              <h2 className={styles.recipeName}>{recipe.name}</h2>
              <p className={styles.recipeDescription}>{recipe.description}</p>
              <div className={styles.recipeDetails}>
                <span>זמן הכנה: {recipe.prepTime} דקות</span>
                <span>רמת קושי: {recipe.difficulty}</span>
              </div>
              <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
                צפה במתכון
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.recipeListContainer}>
      <h1 className={styles.title}>המתכונים שלנו</h1>
      
      {/* קומפוננטת חיפוש מתקדם */}
      <AdvancedSearch onSearch={handleAdvancedSearch} />

      {/* רשימת המתכונים */}
      {renderContent()}

      {/* קומפוננטת עימוד */}
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

export default RecipeList;