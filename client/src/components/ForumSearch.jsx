import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';
import styles from './ForumSearch.module.css';

const ForumSearch = ({ onSelectTopic }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: searchResults, isLoading, error } = useQuery(
    ['forumSearch', searchTerm],
    () => api.searchForumTopics(searchTerm),
    { enabled: searchTerm.length > 2 }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    // Trigger search query
  };

  return (
    <div className={styles.forumSearch}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="חפש בפורום..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>חפש</button>
      </form>
      {isLoading && <p>מחפש...</p>}
      {error && <p>שגיאה בחיפוש: {error.message}</p>}
      {searchResults && (
        <ul className={styles.searchResults}>
          {searchResults.map(topic => (
            <li key={topic._id} onClick={() => onSelectTopic(topic._id)}>
              {topic.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ForumSearch;