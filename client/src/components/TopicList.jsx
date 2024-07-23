import React from 'react';
import styles from './TopicList.module.css';

const TopicList = ({ topics, onSelectTopic }) => {
  return (
    <div className={styles.topicList}>
      {topics.map(topic => (
        <div key={topic._id} className={styles.topicItem} onClick={() => onSelectTopic(topic._id)}>
          <h3 className={styles.topicTitle}>{topic.title}</h3>
          <p className={styles.topicAuthor}>מאת: {topic.author.username}</p>
          <p className={styles.topicDate}>נוצר ב: {new Date(topic.createdAt).toLocaleDateString()}</p>
          <p className={styles.topicReplies}>תגובות: {topic.replies.length}</p>
        </div>
      ))}
    </div>
  );
};

export default TopicList;