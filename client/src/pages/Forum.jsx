import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { useToast } from '../components/Toast';
import TopicList from '../components/TopicList';
import TopicThread from '../components/TopicThread';
import NewTopicForm from '../components/NewTopicForm';
import ForumSearch from '../components/ForumSearch';
import Pagination from '../components/Pagination';
import styles from './Forum.module.css';

const Forum = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isNewTopicFormOpen, setIsNewTopicFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();
  const user = useSelector(state => state.auth.user);
  const queryClient = useQueryClient();

  const {
    data: forumData,
    isLoading,
    error
  } = useQuery(
    ['forumTopics', currentPage, searchTerm],
    () => searchTerm
      ? api.searchForumTopics(searchTerm, currentPage)
      : api.getForumTopics(currentPage),
    { keepPreviousData: true }
  );

  const createTopicMutation = useMutation(
    newTopic => api.createForumTopic(newTopic),
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

  const deleteTopicMutation = useMutation(
    topicId => api.deleteForumTopic(topicId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('forumTopics');
        addToast('הנושא נמחק בהצלחה', 'success');
        setSelectedTopic(null);
      },
      onError: () => {
        addToast('שגיאה במחיקת הנושא', 'error');
      }
    }
  );

  const handleCreateTopic = (topicData) => {
    createTopicMutation.mutate({ ...topicData, authorId: user.id });
  };

  const handleDeleteTopic = (topicId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק נושא זה?')) {
      deleteTopicMutation.mutate(topicId);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const isModerator = user && (user.role === 'moderator' || user.role === 'admin');

  if (isLoading) return <div className={styles.loading}>טוען את הפורום...</div>;
  if (error) return <div className={styles.error}>שגיאה בטעינת הפורום: {error.message}</div>;

  return (
    <div className={styles.forumContainer}>
      <h1 className={styles.forumTitle}>פורום קהילתי</h1>
      <ForumSearch onSearch={handleSearch} />
      {selectedTopic ? (
        <TopicThread 
          topicId={selectedTopic} 
          onBack={() => setSelectedTopic(null)}
          isModerator={isModerator}
          onDeleteTopic={handleDeleteTopic}
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
            topics={forumData?.topics} 
            onSelectTopic={setSelectedTopic}
            isModerator={isModerator}
            onDeleteTopic={handleDeleteTopic}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={forumData?.totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Forum;