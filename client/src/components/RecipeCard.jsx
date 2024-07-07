import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GiPeanut, GiMilkCarton, GiWheat } from 'react-icons/gi';
import { FaEgg } from 'react-icons/fa';
import styles from './RecipeCard.module.css';

// מיפוי אייקונים לאלרגנים
const allergenIcons = {
  'בוטנים': GiPeanut,
  'חלב': GiMilkCarton,
  'ביצים': FaEgg,
  'גלוטן': GiWheat
};

// קומפוננטת RecipeCard מציגה כרטיסיה של מתכון בודד
const RecipeCard = React.memo(({ recipe }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // פונקציה להצגת תיאור מקוצר
  const truncateDescription = (text, maxLength = 100) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  // אפקט לטעינת התמונה בצורה עצלה
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = recipe.image;
  }, [recipe.image]);

  return (
    <div className={styles.recipeCard}>
      {/* תמונת המתכון עם טעינה עצלה */}
      {recipe.image && (
        <div className={styles.imageContainer}>
          {imageLoaded ? (
            <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} />
          ) : (
            <div className={styles.imagePlaceholder}>טוען תמונה...</div>
          )}
        </div>
      )}
      
      <div className={styles.recipeContent}>
        {/* שם המתכון */}
        <h3 className={styles.recipeTitle}>{recipe.name}</h3>
        
        {/* תיאור קצר של המתכון */}
        <p className={styles.recipeDescription}>
          {truncateDescription(recipe.description || recipe.ingredients)}
        </p>
        
        {/* אייקונים של אלרגנים */}
        <div className={styles.allergenIcons}>
          {recipe.allergens.map(allergen => {
            const Icon = allergenIcons[allergen];
            return Icon ? <Icon key={allergen} className={styles.allergenIcon} title={allergen} /> : null;
          })}
        </div>
        
        {/* זמן הכנה ורמת קושי */}
        <div className={styles.recipeDetails}>
          <span>זמן הכנה: {recipe.prepTime} דקות</span>
          <span>רמת קושי: {recipe.difficulty}</span>
        </div>
        
        {/* כפתור לצפייה במתכון המלא */}
        <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
          צפה במתכון
        </Link>
      </div>
    </div>
  );
});

// הוספת שם תצוגה לקומפוננטה עבור כלי פיתוח
RecipeCard.displayName = 'RecipeCard';

export default RecipeCard;