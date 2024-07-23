import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import { useToast } from '../components/Toast';
import styles from './CommentSection.module.css';

const CommentSection = ({ comments = [], recipeId }) => {
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const addCommentMutation = useMutation(
    (commentData) => api.post(`/recipes/${recipeId}/comments`, commentData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['recipe', recipeId]);
        addToast('התגובה נוספה בהצלחה', 'success');
        setNewComment('');
      },
      onError: (error) => {
        addToast(`שגיאה בהוספת התגובה: ${error.message}`, 'error');
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addCommentMutation.mutate({ content: newComment });
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
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              <p className={styles.commentAuthor}>{comment.author}</p>
              <p className={styles.commentContent}>{comment.content}</p>
              <p className={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString('he-IL')}</p>
            </div>
          ))
        ) : (
          <p>אין תגובות עדיין.</p>
        )}
      </div>
    </section>
  );
};

export default CommentSection;