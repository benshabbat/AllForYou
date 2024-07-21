import React from 'react';
import PropTypes from 'prop-types';
import styles from './InstructionList.module.css';

const InstructionList = ({ instructions }) => {
  return (
    <section className={styles.instructionList}>
      <h2 className={styles.sectionTitle}>הוראות הכנה</h2>
      <ol className={styles.instructions}>
        {instructions.map((step, index) => (
          <li key={index} className={styles.instructionStep}>
            <span className={styles.stepNumber}>{index + 1}</span>
            <p className={styles.stepText}>{step.trim()}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

InstructionList.propTypes = {
  instructions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default InstructionList;