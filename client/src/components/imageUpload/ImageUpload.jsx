import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import styles from './ImageUpload.module.css';

/**
 * ImageUpload component for handling image uploads with preview.
 * 
 * @param {Object} props
 * @param {Function} props.onChange - Callback function when image is selected or removed
 * @param {string} props.preview - URL of the preview image
 * @param {Object} props.error - Error object containing error message
 */
const ImageUpload = ({ onChange, preview, error: propError }) => {
  const [error, setError] = useState(propError);
  const [previewUrl, setPreviewUrl] = useState(preview);

  useEffect(() => {
    setError(propError);
  }, [propError]);

  useEffect(() => {
    setPreviewUrl(preview);
  }, [preview]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onChange({ target: { files: [file] } });
      setError(null);
      setPreviewUrl(URL.createObjectURL(file));
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

  const handleRemove = useCallback(() => {
    onChange({ target: { files: [] } });
    setError(null);
    setPreviewUrl(null);
  }, [onChange]);

  return (
    <div className={styles.imageUpload}>
      <div 
        {...getRootProps()} 
        className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''}`}
      >
        <input {...getInputProps()} />
        {previewUrl ? (
          <img src={previewUrl} alt="תצוגה מקדימה של התמונה" className={styles.preview} />
        ) : (
          <p>גרור ושחרר תמונה כאן, או לחץ לבחירת תמונה</p>
        )}
      </div>
      {error && <span className={styles.error} role="alert">{error.message}</span>}
      {previewUrl && (
        <button 
          type="button" 
          onClick={handleRemove}
          className={styles.removeButton}
          aria-label="הסר תמונה"
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

export default React.memo(ImageUpload);