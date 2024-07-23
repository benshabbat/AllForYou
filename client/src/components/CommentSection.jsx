import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { FaEdit, FaTrash } from 'react-icons/fa';
import api from '../services/api';
import { useToast } from '../components/Toast';
import styles from './CommentSection.module.css';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addCommentMutation.mutate({ content: newComment });
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
  };

  const handleUpdate = (commentId) => {
    if (editingComment.content.trim()) {
      editCommentMutation.mutate({ commentId, content: editingComment.content });
    }
  };

  const handleDelete = (commentId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק תגובה זו?')) {
      deleteCommentMutation.mutate(commentId);
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
          comments.map((comment) => (
            <div key={comment._id} className={styles.comment}>
              {editingComment && editingComment._id === comment._id ? (
                <>
                  <textarea
                    value={editingComment.content}
                    onChange={(e) => setEditingComment({...editingComment, content: e.target.value})}
                    className={styles.editInput}
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
                      <button onClick={() => handleEdit(comment)} className={styles.editButton}><FaEdit /> ערוך</button>
                      <button onClick={() => handleDelete(comment._id)} className={styles.deleteButton}><FaTrash /> מחק</button>
                    </div>
                  )}
                </>
              )}
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