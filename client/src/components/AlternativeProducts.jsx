import React from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';
import styles from './AlternativeProducts.module.css';

const AlternativeProducts = ({ product, userAllergens }) => {
  const { data: alternatives, isLoading, error } = useQuery(
    ['alternatives', product._id, userAllergens],
    () => api.get(`/products/alternatives`, {
      params: { 
        productId: product._id,
        allergens: userAllergens.join(',')
      }
    }).then(res => res.data),
    {
      enabled: !!product && userAllergens.length > 0,
    }
  );

  if (isLoading) return <div>מחפש מוצרים חלופיים...</div>;
  if (error) return <div>שגיאה בטעינת מוצרים חלופיים</div>;
  if (!alternatives || alternatives.length === 0) return <div>לא נמצאו מוצרים חלופיים</div>;

  return (
    <div className={styles.alternativeProducts}>
      <h3>מוצרים חלופיים מומלצים</h3>
      <ul className={styles.productList}>
        {alternatives.map((alt) => (
          <li key={alt._id} className={styles.productItem}>
            <img src={alt.image} alt={alt.name} className={styles.productImage} />
            <div className={styles.productInfo}>
              <h4>{alt.name}</h4>
              <p>{alt.manufacturer}</p>
              <p>אלרגנים: {alt.allergens.join(', ') || 'ללא'}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlternativeProducts;