import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { useToast } from '../components/Toast';
import TopicList from './TopicList';
import TopicThread from './TopicThread';
import NewTopicForm from './NewTopicForm';
import styles from './Forum.module.css';

const Forum = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isNewTopicFormOpen, setIsNewTopicFormOpen] = useState(false);
  const { addToast } = useToast();
  const user = useSelector(state => state.auth.user);
  const queryClient = useQueryClient();

  const { data: topics, isLoading, error } = useQuery('forumTopics', () =>
    api.get('/forum/topics').then(res => res.data)
  );

  const createTopicMutation = useMutation(
    newTopic => api.post('/forum/topics', newTopic),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('forumTopics');
        addToast('הנושא נוצר בהצלחה', 'success');
        setIsNewTopicFormOpen(false);
      },
      onError: () => {
        addToast('שגיאה ביצירת הנושא', 'error');
      }
    }
  );

  const handleCreateTopic = (topicData) => {
    createTopicMutation.mutate({ ...topicData, authorId: user.id });
  };

  if (isLoading) return <div className={styles.loading}>טוען את הפורום...</div>;
  if (error) return <div className={styles.error}>שגיאה בטעינת הפורום: {error.message}</div>;

  return (
    <div className={styles.forumContainer}>
      <h1 className={styles.forumTitle}>פורום קהילתי</h1>
      {selectedTopic ? (
        <TopicThread 
          topicId={selectedTopic} 
          onBack={() => setSelectedTopic(null)} 
        />
      ) : (
        <>
          <button 
            className={styles.newTopicButton} 
            onClick={() => setIsNewTopicFormOpen(true)}
          >
            פתח נושא חדש
          </button>
          {isNewTopicFormOpen && (
            <NewTopicForm 
              onSubmit={handleCreateTopic} 
              onCancel={() => setIsNewTopicFormOpen(false)} 
            />
          )}
          <TopicList 
            topics={topics} 
            onSelectTopic={setSelectedTopic} 
          />
        </>
      )}
    </div>
  );
};

export default Forum;