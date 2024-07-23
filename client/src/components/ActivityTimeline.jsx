import React from 'react';
import { useQuery } from 'react-query';
import { FaUtensils, FaHeart, FaComment } from 'react-icons/fa';
import api from '../services/api';
import styles from './ActivityTimeline.module.css';

const ActivityTimeline = ({ userId }) => {
  const { data: activities, isLoading, error } = useQuery(['userActivities', userId], () =>
    api.get(`/users/${userId}/activities`).then(res => res.data)
  );

  if (isLoading) return <div>טוען פעילויות...</div>;
  if (error) return <div>שגיאה בטעינת פעילויות: {error.message}</div>;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'recipe': return <FaUtensils />;
      case 'favorite': return <FaHeart />;
      case 'comment': return <FaComment />;
      default: return null;
    }
  };

  return (
    <div className={styles.timeline}>
      {activities.map((activity, index) => (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineIcon}>{getActivityIcon(activity.type)}</div>
          <div className={styles.timelineContent}>
            <p>{activity.description}</p>
            <span className={styles.timelineDate}>{new Date(activity.date).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;