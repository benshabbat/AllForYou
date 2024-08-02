import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './ProductInfo.module.css';

/**
 * ProductInfo component for displaying detailed information about a food product.
 * 
 * @param {Object} props
 * @param {Object} props.product - The product object containing all the information
 */
const ProductInfo = ({ product }) => {
  const nutritionInfo = useMemo(() => {
    return product.nutriments ? [
      { label: 'קלוריות', value: product.nutriments.energy_100g, unit: 'קק"ל' },
      { label: 'חלבונים', value: product.nutriments.proteins_100g, unit: 'גרם' },
      { label: 'פחמימות', value: product.nutriments.carbohydrates_100g, unit: 'גרם' },
      { label: 'שומנים', value: product.nutriments.fat_100g, unit: 'גרם' },
    ] : [];
  }, [product.nutriments]);

  return (
    <div className={styles.productInfo}>
      <h2 className={styles.productName}>{product.product_name}</h2>
      <p className={styles.productBrand}><strong>מותג:</strong> {product.brands || 'לא ידוע'}</p>
      <p className={styles.productQuantity}><strong>כמות:</strong> {product.quantity || 'לא ידוע'}</p>

      <div className={styles.ingredients}>
        <h3>רכיבים:</h3>
        <p>{product.ingredients_text || 'מידע לא זמין'}</p>
      </div>

      {nutritionInfo.length > 0 && (
        <div className={styles.nutritionInfo}>
          <h3>מידע תזונתי (ל-100 גרם/מ"ל):</h3>
          <ul>
            {nutritionInfo.map((item, index) => (
              <li key={index}>
                <span className={styles.nutrientLabel}>{item.label}:</span>
                <span className={styles.nutrientValue}>
                  {item.value !== undefined ? `${item.value} ${item.unit}` : 'לא ידוע'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {product.allergens && (
        <div className={styles.allergens}>
          <h3>אלרגנים:</h3>
          <p>{product.allergens || 'לא ידוע'}</p>
        </div>
      )}

      {product.image_url && (
        <div className={styles.productImage}>
          <img src={product.image_url} alt={product.product_name} />
        </div>
      )}
    </div>
  );
};

ProductInfo.propTypes = {
  product: PropTypes.shape({
    product_name: PropTypes.string.isRequired,
    brands: PropTypes.string,
    quantity: PropTypes.string,
    ingredients_text: PropTypes.string,
    allergens: PropTypes.string,
    image_url: PropTypes.string,
    nutriments: PropTypes.shape({
      energy_100g: PropTypes.number,
      proteins_100g: PropTypes.number,
      carbohydrates_100g: PropTypes.number,
      fat_100g: PropTypes.number,
    }),
  }).isRequired,
};

export default React.memo(ProductInfo);