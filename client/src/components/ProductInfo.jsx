import React from 'react';
import styles from './ProductInfo.module.css';

const ProductInfo = ({ product }) => {
  return (
    <div className={styles.productInfo}>
      <h3>{product.product_name}</h3>
      <p><strong>מותג:</strong> {product.brands}</p>
      <p><strong>כמות:</strong> {product.quantity}</p>
      <p><strong>רכיבים:</strong> {product.ingredients_text}</p>
      {product.nutriments && (
        <div className={styles.nutritionInfo}>
          <h4>מידע תזונתי</h4>
          <p>קלוריות: {product.nutriments.energy_100g} קק"ל ל-100 גרם</p>
          <p>חלבונים: {product.nutriments.proteins_100g}g ל-100 גרם</p>
          <p>פחמימות: {product.nutriments.carbohydrates_100g}g ל-100 גרם</p>
          <p>שומנים: {product.nutriments.fat_100g}g ל-100 גרם</p>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;