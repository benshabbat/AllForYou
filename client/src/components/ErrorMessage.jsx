import React from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorMessage.module.css';

function ErrorMessage({ message, type = 'error' }) {
  return (
    <div className={`${styles.message} ${styles[type]}`}>
      <p>{message}</p>
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error', 'warning', 'info']),
};

export default ErrorMessage;