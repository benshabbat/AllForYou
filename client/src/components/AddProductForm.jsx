import React, { useState } from 'react';
import styles from './AddProductForm.module.css';

const AddProductForm = ({ onSubmit, onCancel }) => {
  const [productData, setProductData] = useState({
    product_name: '',
    brands: '',
    quantity: '',
    ingredients_text: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>הוסף מוצר חדש</h3>
      <input
        type="text"
        name="product_name"
        value={productData.product_name}
        onChange={handleChange}
        placeholder="שם המוצר"
        required
      />
      <input
        type="text"
        name="brands"
        value={productData.brands}
        onChange={handleChange}
        placeholder="מותג"
      />
      <input
        type="text"
        name="quantity"
        value={productData.quantity}
        onChange={handleChange}
        placeholder="כמות"
      />
      <textarea
        name="ingredients_text"
        value={productData.ingredients_text}
        onChange={handleChange}
        placeholder="רכיבים"
      />
      <div className={styles.buttons}>
        <button type="submit">הוסף מוצר</button>
        <button type="button" onClick={onCancel}>ביטול</button>
      </div>
    </form>
  );
};

export default AddProductForm;