import React from 'react';
import styles from './Skeleton.module.css';

const Skeleton = ({ width, height }) => (
  <div 
    className={styles.skeleton} 
    style={{ width, height }}
  />
);

export default Skeleton;