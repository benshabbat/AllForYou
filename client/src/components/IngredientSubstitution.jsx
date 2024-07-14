import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import api from '../services/api';
import styles from './IngredientSubstitution.module.css';

const IngredientSubstitution = ({ ingredient }) => {
  const [showSubstitutes, setShowSubstitutes] = useState(false);

  const { data: substitutes, isLoading, error } = useQuery(
    ['substitutes', ingredient],
    () => api.get(`/ingredients/substitutes?ingredient=${encodeURIComponent(ingredient)}`).then(res => res.data),
    { enabled: showSubstitutes }
  );

  if (!showSubstitutes) {
    return (
      <button className={styles.showSubstitutesButton} onClick={() => setShowSubstitutes(true)}>
        Show substitutes
      </button>
    );
  }

  if (isLoading) return <span>Loading substitutes...</span>;
  if (error) return <span>Error loading substitutes</span>;

  return (
    <div className={styles.substitutesContainer}>
      <h4>Substitutes for {ingredient}:</h4>
      {substitutes.length > 0 ? (
        <ul>
          {substitutes.map((substitute, index) => (
            <li key={index}>{substitute}</li>
          ))}
        </ul>
      ) : (
        <p>No substitutes found for this ingredient.</p>
      )}
      <button className={styles.hideSubstitutesButton} onClick={() => setShowSubstitutes(false)}>
        Hide substitutes
      </button>
    </div>
  );
};

IngredientSubstitution.propTypes = {
  ingredient: PropTypes.string.isRequired
};

export default IngredientSubstitution;