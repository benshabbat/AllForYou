import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaMinus } from 'react-icons/fa';
import styles from './IngredientList.module.css';

const IngredientList = ({ ingredients, defaultServings }) => {
  const [servings, setServings] = useState(defaultServings);

  const adjustQuantity = (quantity) => {
    if (!quantity) return '';
    const numericPart = quantity.match(/\d+(\.\d+)?/);
    if (!numericPart) return quantity;
    
    const adjustedQuantity = parseFloat(numericPart[0]) * (servings / defaultServings);
    return quantity.replace(numericPart[0], adjustedQuantity.toFixed(2));
  };

  const handleServingsChange = (change) => {
    setServings(prevServings => Math.max(1, prevServings + change));
  };

  return (
    <section className={styles.ingredientList}>
      <h2 className={styles.sectionTitle}>מרכיבים</h2>
      <div className={styles.servingsAdjuster}>
        <button onClick={() => handleServingsChange(-1)} className={styles.adjustButton} aria-label="הפחת מנות">
          <FaMinus />
        </button>
        <span className={styles.servingsCount}>{servings} מנות</span>
        <button onClick={() => handleServingsChange(1)} className={styles.adjustButton} aria-label="הוסף מנות">
          <FaPlus />
        </button>
      </div>
      <ul className={styles.ingredients}>
        {ingredients.map((ingredient, index) => {
          const [quantity, ...rest] = ingredient.split(' ');
          const adjustedQuantity = adjustQuantity(quantity);
          const ingredientName = rest.join(' ');
          
          return (
            <li key={index} className={styles.ingredientItem}>
              <span className={styles.quantity}>{adjustedQuantity}</span>
              <span className={styles.ingredientName}>{ingredientName}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

IngredientList.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultServings: PropTypes.number.isRequired,
};

export default IngredientList;