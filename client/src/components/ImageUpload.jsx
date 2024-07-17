import React from 'react';
import styles from './ImageUpload.module.css';

const ImageUpload = ({ onChange, preview, error }) => {
  return (
    <div className={styles.imageUpload}>
      <label htmlFor="image" className={styles.uploadLabel}>
        העלאת תמונה
      </label>
      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={onChange}
        className={styles.fileInput}
      />
      {preview && (
        <div className={styles.imagePreview}>
          <img src={preview} alt="תצוגה מקדימה של התמונה" />
        </div>
      )}
      {error && <span className={styles.error}>{error.message}</span>}
    </div>
  );
};

export default ImageUpload;