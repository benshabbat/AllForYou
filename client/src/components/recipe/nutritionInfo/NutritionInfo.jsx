import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaInfoCircle, FaMinus, FaPlus } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import styles from './NutritionInfo.module.css';

const NutritionInfo = ({ nutritionInfo, servings: initialServings }) => {
  const [servings, setServings] = useState(initialServings);

  const calculatePerServing = (value) => {
    return Math.round((value / initialServings) * servings);
  };

  const getDailyValuePercentage = (nutrient, value) => {
    const dailyValues = {
      calories: 2000,
      protein: 50,
      carbohydrates: 300,
      fat: 65,
      fiber: 25,
      sugar: 50,
      sodium: 2300,
    };
    return Math.round((value / dailyValues[nutrient]) * 100);
  };

  const nutritionItems = [
    { label: 'קלוריות', value: nutritionInfo.calories, unit: '', nutrient: 'calories' },
    { label: 'חלבונים', value: nutritionInfo.protein, unit: 'גרם', nutrient: 'protein' },
    { label: 'פחמימות', value: nutritionInfo.carbohydrates, unit: 'גרם', nutrient: 'carbohydrates' },
    { label: 'שומנים', value: nutritionInfo.fat, unit: 'גרם', nutrient: 'fat' },
    { label: 'סיבים תזונתיים', value: nutritionInfo.fiber, unit: 'גרם', nutrient: 'fiber' },
    { label: 'סוכר', value: nutritionInfo.sugar, unit: 'גרם', nutrient: 'sugar' },
    { label: 'נתרן', value: nutritionInfo.sodium, unit: 'מ"ג', nutrient: 'sodium' },
  ];

  return (
    <section className={styles.nutritionInfo}>
      <h2 className={styles.sectionTitle}>מידע תזונתי</h2>
      <div className={styles.servingsAdjuster}>
        <button onClick={() => setServings(Math.max(1, servings - 1))} aria-label="הפחת מנה">
          <FaMinus />
        </button>
        <span className={styles.servingInfo}>ערכים ל-{servings} מנות (מתוך {initialServings} מנות)</span>
        <button onClick={() => setServings(servings + 1)} aria-label="הוסף מנה">
          <FaPlus />
        </button>
      </div>
      <div className={styles.nutritionGrid}>
        {nutritionItems.map((item, index) => (
          item.value && (
            <div key={index} className={styles.nutritionItem}>
              <span className={styles.nutrientLabel}>{item.label}</span>
              <span className={styles.nutrientValue}>
                {calculatePerServing(item.value)}
                {item.unit && <span className={styles.nutrientUnit}>{item.unit}</span>}
              </span>
              <div className={styles.dailyValueBar}>
                <div 
                  className={styles.dailyValueFill} 
                  style={{ width: `${getDailyValuePercentage(item.nutrient, calculatePerServing(item.value))}%` }}
                />
              </div>
              <span className={styles.dailyValuePercentage}>
                {getDailyValuePercentage(item.nutrient, calculatePerServing(item.value))}% 
                <FaInfoCircle 
                  className={styles.infoIcon} 
                  data-tooltip-id={`daily-value-${index}`}
                  data-tooltip-content={`אחוז מהערך היומי המומלץ`}
                />
                <Tooltip id={`daily-value-${index}`} />
              </span>
            </div>
          )
        ))}
      </div>
      <p className={styles.disclaimer}>
        * הערכים התזונתיים הם הערכה בלבד ועשויים להשתנות בהתאם למרכיבים הספציפיים ושיטות ההכנה.
        הערכים היומיים מבוססים על דיאטה של 2000 קלוריות.
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