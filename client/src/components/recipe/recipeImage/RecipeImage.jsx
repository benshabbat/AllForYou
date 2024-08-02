import React from 'react';
import PropTypes from 'prop-types';
import styles from './RecipeImage.module.css';

const RecipeImage = ({ imageSrc, altText }) => (
  <img
    src={imageSrc}
    alt={altText}
    className={styles.recipeImage}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = '/placeholder-image.jpg';
    }}
  />
);

RecipeImage.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired
};

export default React.memo(RecipeImage);