import React from 'react';
import styles from './SearchSuggestions.module.css';

const SearchSuggestions = ({ suggestions, onSuggestionClick }) => {
  if (!suggestions.length) return null;

  return (
    <ul className={styles.suggestionsList}>
      {suggestions.map((suggestion, index) => (
        <li key={index} className={styles.suggestionItem} onClick={() => onSuggestionClick(suggestion)}>
          {suggestion}
        </li>
      ))}
    </ul>
  );
};

export default SearchSuggestions;