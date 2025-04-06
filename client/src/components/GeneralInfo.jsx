import React from 'react';
import PropTypes from 'prop-types';
import styles from './GeneralInfo.module.css';

const GeneralInfo = ({ info }) => (
  <div className={styles.generalInfo}>
    <h2>מידע כללי</h2>
    {info.map((item, index) => (
      <p key={index}>{item}</p>
    ))}
  </div>
);

GeneralInfo.propTypes = {
  info: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default GeneralInfo;