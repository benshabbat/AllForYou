import React from 'react';
import PropTypes from 'prop-types';
import styles from './Skeleton.module.css';

const Skeleton = ({ width, height, borderRadius, className }) => (
  <div 
    className={`${styles.skeleton} ${className}`} 
    style={{ width, height, borderRadius }}
  />
);

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  borderRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};

Skeleton.defaultProps = {
  width: '100%',
  height: '20px',
  borderRadius: '4px',
};

export default Skeleton;