import React from 'react';
import PropTypes from 'prop-types';
import styles from './InstructionList.module.css';

const InstructionList = ({ instructions }) => {
  // מפצל את ההוראות לצעדים נפרדים
  const steps = instructions.split('\n').filter(step => step.trim() !== '');

  return (
    <section className={styles.instructionList}>
      <h2 className={styles.sectionTitle}>הוראות הכנה</h2>
      <ol className={styles.instructions}>
        {steps.map((step, index) => (
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
  instructions: PropTypes.string.isRequired,
};

export default InstructionList;