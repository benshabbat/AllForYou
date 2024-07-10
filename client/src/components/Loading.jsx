import React from 'react';
import PropTypes from 'prop-types';
import styles from './Loading.module.css';

function Loading({ message = 'טוען...' }) {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}

Loading.propTypes = {
  message: PropTypes.string,
};

export default Loading;