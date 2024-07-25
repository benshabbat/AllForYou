import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './NewTopicForm.module.css';

const schema = yup.object().shape({
  title: yup.string().required('כותרת הנושא היא שדה חובה').min(3, 'הכותרת חייבת להכיל לפחות 3 תווים'),
  content: yup.string().required('תוכן הנושא הוא שדה חובה').min(10, 'התוכן חייב להכיל לפחות 10 תווים'),
});

/**
 * NewTopicForm component for creating a new forum topic.
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback function when form is submitted
 * @param {Function} props.onCancel - Callback function when form is cancelled
 */
const NewTopicForm = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitForm = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting new topic:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit]);

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className={styles.newTopicForm}>
      <h2>יצירת נושא חדש</h2>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>כותרת הנושא</label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
          placeholder="הזן כותרת לנושא"
        />
        {errors.title && <span className={styles.errorMessage}>{errors.title.message}</span>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="content" className={styles.label}>תוכן הנושא</label>
        <textarea
          id="content"
          {...register('content')}
          className={`${styles.textarea} ${errors.content ? styles.inputError : ''}`}
          placeholder="הזן את תוכן הנושא"
        />
        {errors.content && <span className={styles.errorMessage}>{errors.content.message}</span>}
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'שולח...' : 'פרסם נושא'}
        </button>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          בטל
        </button>
      </div>
    </form>
  );
};

NewTopicForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default React.memo(NewTopicForm);