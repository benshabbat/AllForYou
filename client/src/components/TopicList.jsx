import React from 'react';
import styles from './TopicList.module.css';

const TopicList = ({ topics = [], onSelectTopic, isModerator, onDeleteTopic }) => {
  if (topics.length === 0) {
    return <div className={styles.noTopics}>אין נושאים להצגה.</div>;
  }

  return (
    <div className={styles.topicList}>
      {topics.map(topic => (
        <div key={topic._id} className={styles.topicItem}>
          <h3 className={styles.topicTitle} onClick={() => onSelectTopic(topic._id)}>
            {topic.title}
          </h3>
          <p className={styles.topicAuthor}>מאת: {topic.author.username}</p>
          <p className={styles.topicDate}>נוצר ב: {new Date(topic.createdAt).toLocaleDateString()}</p>
          <p className={styles.topicReplies}>תגובות: {topic.replies.length}</p>
          {isModerator && (
            <button 
              className={styles.deleteButton}
              onClick={() => onDeleteTopic(topic._id)}
            >
              מחק נושא
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TopicList;