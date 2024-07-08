import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GiPeanut, GiMilkCarton, GiWheat } from 'react-icons/gi';
import { FaEgg } from 'react-icons/fa';
import styles from './RecipeCard.module.css';

const allergenIcons = {
  'בוטנים': GiPeanut,
  'חלב': GiMilkCarton,
  'ביצים': FaEgg,
  'גלוטן': GiWheat
};

const RecipeCard = React.memo(({ recipe }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    console.log('Recipe data in RecipeCard:', recipe);
  }, [recipe]);

  const truncateDescription = (text, maxLength = 100) => {
    return text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  useEffect(() => {
    if (recipe.image) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = recipe.image;
    }
  }, [recipe.image]);

  if (!recipe) {
    console.log('Recipe is undefined or null');
    return null;
  }

  return (
    <div className={styles.recipeCard}>
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
        <h3 className={styles.recipeTitle}>{recipe.name}</h3>
        
        <p className={styles.recipeDescription}>
          {truncateDescription(recipe.description || recipe.ingredients)}
        </p>
        
        <div className={styles.allergenIcons}>
          {recipe.allergens?.map(allergen => {
            const Icon = allergenIcons[allergen];
            return Icon ? <Icon key={allergen} className={styles.allergenIcon} title={allergen} /> : null;
          })}
        </div>
        
        <div className={styles.recipeDetails}>
          <span>זמן הכנה: {recipe.prepTime} דקות</span>
          <span>רמת קושי: {recipe.difficulty}</span>
        </div>
        
        <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
          צפה במתכון
        </Link>
      </div>
    </div>
  );
});

RecipeCard.displayName = 'RecipeCard';

export default RecipeCard;