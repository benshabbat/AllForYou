import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import styles from './ImageUpload.module.css';

const ImageUpload = ({ onChange, preview, error: propError }) => {
  const [error, setError] = useState(propError);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onChange({ target: { files: [file] } });
      setError(null);
    } else if (rejectedFiles && rejectedFiles.length > 0) {
      setError({ message: 'קובץ לא תקין. אנא העלה קובץ תמונה בפורמט נתמך.' });
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false,
  });

  return (
    <div className={styles.imageUpload}>
      <div 
        {...getRootProps()} 
        className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="תצוגה מקדימה של התמונה" className={styles.preview} />
        ) : (
          <p>גרור ושחרר תמונה כאן, או לחץ לבחירת תמונה (אופציונלי)</p>
        )}
      </div>
      {error && <span className={styles.error}>{error.message}</span>}
      {preview && (
        <button 
          type="button" 
          onClick={() => {
            onChange({ target: { files: [] } });
            setError(null);
          }}
          className={styles.removeButton}
        >
          הסר תמונה
        </button>
      )}
    </div>
  );
};

ImageUpload.propTypes = {
  onChange: PropTypes.func.isRequired,
  preview: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string
  })
};

export default ImageUpload;