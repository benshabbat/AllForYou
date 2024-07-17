import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchBar}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="חפש מתכונים..."
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton} aria-label="חפש">
        <FaSearch className={styles.searchIcon} />
      </button>
    </form>
  );
};

export default SearchBar;