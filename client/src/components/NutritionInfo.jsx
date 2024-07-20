import React from 'react';
import PropTypes from 'prop-types';
import styles from './NutritionInfo.module.css';

const NutritionInfo = ({ nutritionInfo, servings }) => {
  const calculatePerServing = (value) => {
    return Math.round(value / servings);
  };

  const nutritionItems = [
    { label: 'קלוריות', value: nutritionInfo.calories, unit: '' },
    { label: 'חלבונים', value: nutritionInfo.protein, unit: 'גרם' },
    { label: 'פחמימות', value: nutritionInfo.carbohydrates, unit: 'גרם' },
    { label: 'שומנים', value: nutritionInfo.fat, unit: 'גרם' },
    { label: 'סיבים תזונתיים', value: nutritionInfo.fiber, unit: 'גרם' },
    { label: 'סוכר', value: nutritionInfo.sugar, unit: 'גרם' },
    { label: 'נתרן', value: nutritionInfo.sodium, unit: 'מ"ג' },
  ];

  return (
    <section className={styles.nutritionInfo}>
      <h2 className={styles.sectionTitle}>מידע תזונתי</h2>
      <p className={styles.servingInfo}>ערכים לכל מנה (מתוך {servings} מנות)</p>
      <div className={styles.nutritionGrid}>
        {nutritionItems.map((item, index) => (
          item.value && (
            <div key={index} className={styles.nutritionItem}>
              <span className={styles.nutrientLabel}>{item.label}</span>
              <span className={styles.nutrientValue}>
                {calculatePerServing(item.value)}
                {item.unit && <span className={styles.nutrientUnit}>{item.unit}</span>}
              </span>
            </div>
          )
        ))}
      </div>
      <p className={styles.disclaimer}>
        * הערכים התזונתיים הם הערכה בלבד ועשויים להשתנות בהתאם למרכיבים הספציפיים ושיטות ההכנה.
      </p>
    </section>
  );
};

NutritionInfo.propTypes = {
  nutritionInfo: PropTypes.shape({
    calories: PropTypes.number,
    protein: PropTypes.number,
    carbohydrates: PropTypes.number,
    fat: PropTypes.number,
    fiber: PropTypes.number,
    sugar: PropTypes.number,
    sodium: PropTypes.number,
  }).isRequired,
  servings: PropTypes.number.isRequired,
};

export default NutritionInfo;