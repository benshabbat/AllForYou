import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchForumTopic, createForumReply, deleteForumTopic } from '../../../utils/apiUtils';
import {useToast} from '../../common/toast/Toast';
import {Loading} from '../../common';
import ErrorMessage from '../../errorMessage/ErrorMessage';
import styles from './TopicThread.module.css';

const TopicThread = ({ topicId, onBack, isModerator, onDeleteTopic }) => {
  const [replyContent, setReplyContent] = useState('');
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: topic, isLoading, error } = useQuery(
    ['forumTopic', topicId],
    () => fetchForumTopic(topicId)
  );

  const createReplyMutation = useMutation(
    (content) => createForumReply(topicId, { content }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['forumTopic', topicId]);
        addToast('התגובה נוספה בהצלחה', 'success');
        setReplyContent('');
      },
      onError: (error) => {
        addToast(`שגיאה בהוספת תגובה: ${error.message}`, 'error');
      },
    }
  );

  const deleteTopicMutation = useMutation(
    () => deleteForumTopic(topicId),
    {
      onSuccess: () => {
        addToast('הנושא נמחק בהצלחה', 'success');
        onBack();
        onDeleteTopic(topicId);
      },
      onError: (error) => {
        addToast(`שגיאה במחיקת הנושא: ${error.message}`, 'error');
      },
    }
  );

  const handleReplySubmit = useCallback((e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      createReplyMutation.mutate(replyContent);
    }
  }, [replyContent, createReplyMutation]);

  const handleDeleteTopic = useCallback(() => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק נושא זה?')) {
      deleteTopicMutation.mutate();
    }
  }, [deleteTopicMutation]);

  if (isLoading) return <Loading message="טוען נושא..." />;
  if (error) return <ErrorMessage message={`שגיאה בטעינת הנושא: ${error.message}`} />;

  return (
    <div className={styles.topicThread}>
      <button onClick={onBack} className={styles.backButton}>חזרה לרשימת הנושאים</button>
      <h2 className={styles.topicTitle}>{topic.title}</h2>
      <div className={styles.topicContent}>{topic.content}</div>
      <div className={styles.topicMeta}>
        נכתב על ידי {topic.author.username} | {new Date(topic.createdAt).toLocaleString()}
      </div>
      {isModerator && (
        <button onClick={handleDeleteTopic} className={styles.deleteButton}>מחק נושא</button>
      )}
      <div className={styles.replies}>
        <h3>תגובות:</h3>
        {topic.replies.map((reply) => (
          <div key={reply._id} className={styles.reply}>
            <div>{reply.content}</div>
            <div className={styles.replyMeta}>
              נכתב על ידי {reply.author.username} | {new Date(reply.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleReplySubmit} className={styles.replyForm}>
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="הוסף תגובה..."
          className={styles.replyInput}
        />
        <button type="submit" className={styles.submitReply}>שלח תגובה</button>
      </form>
    </div>
  );
};

export default React.memo(TopicThread);