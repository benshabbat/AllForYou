import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaMinus } from 'react-icons/fa';
import styles from './IngredientList.module.css';

const IngredientList = ({ ingredients, defaultServings }) => {
  const [servings, setServings] = useState(defaultServings);

  const adjustQuantity = (amount) => {
    if (!amount) return '';
    const numericPart = amount.match(/\d+(\.\d+)?/);
    if (!numericPart) return amount;
    
    const adjustedQuantity = parseFloat(numericPart[0]) * (servings / defaultServings);
    return amount.replace(numericPart[0], adjustedQuantity.toFixed(2));
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
    {ingredients?.map((ingredient, index) => (
      <li key={index} className={styles.ingredientItem}>
        <span className={styles.quantity}>{adjustQuantity(ingredient.amount)}</span>
        <span className={styles.unit}>{ingredient.unit}</span>
        <span className={styles.ingredientName}>{ingredient.name}</span>
      </li>
    ))}
  </ul>
    </section>
  );
};


IngredientList.propTypes = {
ingredients: PropTypes.arrayOf(PropTypes.shape({
  name: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  unit: PropTypes.string
})).isRequired,
defaultServings: PropTypes.number.isRequired,
};

export default IngredientList;