import React from 'react';
import PropTypes from 'prop-types';
import styles from './GeneralInfo.module.css';

const GeneralInfo = ({ info }) => (
  <div className={styles.generalInfo}>
    <h2>{info.title}</h2>
    <p>{info.content}</p>
    <img src={info.icon} alt={info.title} />
  </div>
);

GeneralInfo.propTypes = {
  info: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
};

export default GeneralInfo;