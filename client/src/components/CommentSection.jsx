import React, { useState } from 'react';
import styles from './CommentSection.module.css';

const CommentSection = ({ comments = [], onAddComment }) => {
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
      <h2>Comments</h2>
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className={styles.commentInput}
        />
        <button type="submit" className={styles.submitButton}>Submit Comment</button>
      </form>
      <div className={styles.commentList}>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              <p className={styles.commentAuthor}>{comment.author}</p>
              <p className={styles.commentContent}>{comment.content}</p>
              <p className={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </section>
  );
};

export default CommentSection;