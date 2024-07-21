import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { FaStar } from 'react-icons/fa';
import api from '../services/api';
import styles from './ProductRatingReview.module.css';

const ProductRatingReview = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const queryClient = useQueryClient();

  const ratingMutation = useMutation(
    (data) => api.post(`/products/${productId}/rate`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['product', productId]);
      },
    }
  );

  const handleRatingSubmit = () => {
    if (rating > 0) {
      ratingMutation.mutate({ rating, review });
    }
  };

  return (
    <div className={styles.ratingReviewContainer}>
      <h4>דרג ותן חוות דעת על המוצר</h4>
      <div className={styles.starRating}>
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1;
          return (
            <label key={i}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
              />
              <FaStar
                className={styles.star}
                color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                size={20}
              />
            </label>
          );
        })}
      </div>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="כתוב את חוות דעתך כאן..."
        className={styles.reviewInput}
      />
      <button onClick={handleRatingSubmit} className={styles.submitButton}>
        שלח דירוג וחוות דעת
      </button>
    </div>
  );
};

export default ProductRatingReview;