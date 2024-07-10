import React from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorMessage.module.css';

function ErrorMessage({ message }) {
  return (
    <div className={styles.error}>
      <p className={styles.message}>{message}</p>
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;