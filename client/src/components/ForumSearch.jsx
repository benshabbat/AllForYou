import React, { useState } from 'react';
import styles from './ForumSearch.module.css';

const ForumSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className={styles.forumSearch}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="חפש בפורום..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>חפש</button>
      </form>
    </div>
  );
};

export default ForumSearch;