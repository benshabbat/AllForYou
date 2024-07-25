import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { FaEdit, FaTrash } from 'react-icons/fa';
import api from '../services/api';
import { useToast } from '../components/Toast';  
import styles from './CommentSection.module.css';

/**
 * CommentSection component for displaying and managing comments on a recipe.
 * 
 * @param {Object} props
 * @param {Array} props.comments - Array of comment objects
 * @param {string} props.recipeId - ID of the recipe
 */
const CommentSection = ({ comments = [], recipeId }) => {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const currentUser = useSelector(state => state.auth.user);

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

  const editCommentMutation = useMutation(
    ({ commentId, content }) => api.put(`/recipes/${recipeId}/comments/${commentId}`, { content }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['recipe', recipeId]);
        addToast('התגובה עודכנה בהצלחה', 'success');
        setEditingComment(null);
      },
      onError: (error) => {
        addToast(`שגיאה בעדכון התגובה: ${error.message}`, 'error');
      },
    }
  );

  const deleteCommentMutation = useMutation(
    (commentId) => api.delete(`/recipes/${recipeId}/comments/${commentId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['recipe', recipeId]);
        addToast('התגובה נמחקה בהצלחה', 'success');
      },
      onError: (error) => {
        addToast(`שגיאה במחיקת התגובה: ${error.message}`, 'error');
      },
    }
  );

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addCommentMutation.mutate({ content: newComment });
    }
  }, [newComment, addCommentMutation]);

  const handleEdit = useCallback((comment) => {
    setEditingComment(comment);
  }, []);

  const handleUpdate = useCallback((commentId) => {
    if (editingComment.content.trim()) {
      editCommentMutation.mutate({ commentId, content: editingComment.content });
    }
  }, [editingComment, editCommentMutation]);

  const handleDelete = useCallback((commentId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק תגובה זו?')) {
      deleteCommentMutation.mutate(commentId);
    }
  }, [deleteCommentMutation]);

  const renderCommentForm = () => (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="הוסף תגובה..."
        className={styles.commentInput}
        aria-label="הוסף תגובה חדשה"
      />
      <button type="submit" className={styles.submitButton}>שלח תגובה</button>
    </form>
  );

  const renderComment = (comment) => (
    <div key={comment._id} className={styles.comment}>
      {editingComment && editingComment._id === comment._id ? (
        <>
          <textarea
            value={editingComment.content}
            onChange={(e) => setEditingComment({...editingComment, content: e.target.value})}
            className={styles.editInput}
            aria-label="ערוך תגובה"
          />
          <button onClick={() => handleUpdate(comment._id)} className={styles.updateButton}>עדכן</button>
          <button onClick={() => setEditingComment(null)} className={styles.cancelButton}>בטל</button>
        </>
      ) : (
        <>
          <p className={styles.commentAuthor}>{comment.author.username}</p>
          <p className={styles.commentContent}>{comment.content}</p>
          <p className={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString('he-IL')}</p>
          {currentUser && (currentUser.id === comment.author._id || currentUser.role === 'admin') && (
            <div className={styles.commentActions}>
              <button onClick={() => handleEdit(comment)} className={styles.editButton} aria-label="ערוך תגובה">
                <FaEdit /> ערוך
              </button>
              <button onClick={() => handleDelete(comment._id)} className={styles.deleteButton} aria-label="מחק תגובה">
                <FaTrash /> מחק
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <section className={styles.commentSection} aria-label="אזור תגובות">
      <h2>תגובות</h2>
      {renderCommentForm()}
      <div className={styles.commentList}>
        {comments && comments.length > 0 ? (
          comments.map(renderComment)
        ) : (
          <p>אין תגובות עדיין.</p>
        )}
      </div>
    </section>
  );
};

CommentSection.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired
    }).isRequired,
    createdAt: PropTypes.string.isRequired
  })),
  recipeId: PropTypes.string.isRequired
};

export default React.memo(CommentSection);