import React, { useState } from 'react';

function CommentSection({ comments, onAddComment }) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="comment-section">
      <h3>תגובות</h3>
      {comments?.map((comment, index) => (
        <div key={index} className="comment">
          <p>{comment.text}</p>
          <small>{new Date(comment.date).toLocaleDateString()}</small>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="הוסף תגובה..."
        />
        <button type="submit">שלח</button>
      </form>
    </div>
  );
}

export default CommentSection;