import React from 'react';
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

const RecipeCard = ({ recipe }) => {
  // פונקציית עזר להצגת תיאור מקוצר
  const truncateDescription = (text, maxLength = 100) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className={styles.recipeCard}>
      {recipe.image && (
        <img 
          src={recipe.image} 
          alt={recipe.name} 
          className={styles.recipeImage}
          loading="lazy" // שיפור ביצועים: טעינה עצלה של תמונות
        />
      )}
      
      <div className={styles.recipeContent}>
        <h3 className={styles.recipeTitle}>{recipe.name}</h3>
        
        <p className={styles.recipeDescription}>
          {truncateDescription(recipe.description || recipe.ingredients)}
        </p>
        
        <div className={styles.allergenIcons}>
          {recipe.allergens.map(allergen => {
            const Icon = allergenIcons[allergen];
            return Icon && <Icon key={allergen} className={styles.allergenIcon} title={allergen} />;
          })}
        </div>
        
        <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
          צפה במתכון
        </Link>
      </div>
    </div>
  );
};

export default React.memo(RecipeCard);