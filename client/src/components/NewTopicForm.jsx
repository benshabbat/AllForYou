import React, { useState } from 'react';
import styles from './NewTopicForm.module.css';

const NewTopicForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.newTopicForm}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="כותרת הנושא"
        className={styles.topicTitle}
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="תוכן הנושא"
        className={styles.topicContent}
        required
      />
      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>צור נושא</button>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>בטל</button>
      </div>
    </form>
  );
};

export default NewTopicForm;