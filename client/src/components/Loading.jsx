import React from 'react';
import PropTypes from 'prop-types';
import styles from './Loading.module.css';

function Loading({ message = 'טוען...', size = 'medium', fullScreen = false }) {
  const containerClass = fullScreen ? styles.fullScreenContainer : styles.container;
  const spinnerClass = `${styles.spinner} ${styles[size]}`;

  return (
    <div className={containerClass}>
      <div className={spinnerClass}></div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

Loading.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullScreen: PropTypes.bool,
};

export default Loading;