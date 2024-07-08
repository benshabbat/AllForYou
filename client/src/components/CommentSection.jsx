import React, { useState } from 'react';
import styles from './CommentSection.module.css';

const CommentSection = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <section className={styles.commentSection}>
      <h2>תגובות</h2>
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="הוסף תגובה..."
          className={styles.commentInput}
        />
        <button type="submit" className={styles.submitButton}>שלח תגובה</button>
      </form>
      <div className={styles.commentList}>
        {comments.map((comment, index) => (
          <div key={index} className={styles.comment}>
            <p className={styles.commentAuthor}>{comment.author}</p>
            <p className={styles.commentContent}>{comment.content}</p>
            <p className={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommentSection;