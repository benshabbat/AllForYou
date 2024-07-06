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

// קומפוננטת RecipeCard מציגה כרטיסיה של מתכון בודד
const RecipeCard = ({ recipe }) => {
  return (
    <div className={styles.recipeCard}>
      {/* תמונת המתכון */}
      {recipe.image && <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} />}
      
      <div className={styles.recipeContent}>
        {/* שם המתכון */}
        <h3 className={styles.recipeTitle}>{recipe.name}</h3>
        
        {/* תיאור קצר של המתכון */}
        <p className={styles.recipeDescription}>
          {recipe.description || recipe.ingredients.slice(0, 100)}...
        </p>
        
        {/* אייקונים של אלרגנים */}
        <div className={styles.allergenIcons}>
          {recipe.allergens.map(allergen => {
            const Icon = allergenIcons[allergen];
            return Icon ? <Icon key={allergen} className={styles.allergenIcon} title={allergen} /> : null;
          })}
        </div>
        
        {/* כפתור לצפייה במתכון המלא */}
        <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
          צפה במתכון
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;