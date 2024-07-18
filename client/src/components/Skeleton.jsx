import React from 'react';
import styles from './Skeleton.module.css';

const Skeleton = ({ type, width, height, count = 1 }) => {
  const classes = `${styles.skeleton} ${styles[type]}`;
  
  return Array.from({ length: count }).map((_, index) => (
    <div key={index} className={classes} style={{ width, height }} />
  ));
};

export default Skeleton;