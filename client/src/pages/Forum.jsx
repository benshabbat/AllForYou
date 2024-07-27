import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { fetchForumTopics, createForumTopic, deleteForumTopic, searchForumTopics } from '../utils/apiUtils';
import { useToast } from '../components/Toast';
import TopicList from '../components/TopicList';
import TopicThread from '../components/TopicThread';
import NewTopicForm from '../components/NewTopicForm';
import ForumSearch from '../components/ForumSearch';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
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
      ? searchForumTopics(searchTerm, currentPage)
      : fetchForumTopics(currentPage),
    { keepPreviousData: true }
  );

  const createTopicMutation = useMutation(createForumTopic, {
    onSuccess: () => {
      queryClient.invalidateQueries('forumTopics');
      addToast('הנושא נוצר בהצלחה', 'success');
      setIsNewTopicFormOpen(false);
    },
    onError: (error) => {
      addToast(`שגיאה ביצירת הנושא: ${error.message}`, 'error');
    }
  });

  const deleteTopicMutation = useMutation(deleteForumTopic, {
    onSuccess: () => {
      queryClient.invalidateQueries('forumTopics');
      addToast('הנושא נמחק בהצלחה', 'success');
      setSelectedTopic(null);
    },
    onError: (error) => {
      addToast(`שגיאה במחיקת הנושא: ${error.message}`, 'error');
    }
  });

  const handleCreateTopic = useCallback((topicData) => {
    createTopicMutation.mutate({ ...topicData, authorId: user.id });
  }, [createTopicMutation, user]);

  const handleDeleteTopic = useCallback((topicId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק נושא זה?')) {
      deleteTopicMutation.mutate(topicId);
    }
  }, [deleteTopicMutation]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const isModerator = useMemo(() => user && (user.role === 'moderator' || user.role === 'admin'), [user]);

  const renderContent = () => {
    if (isLoading) return <Loading message="טוען את הפורום..." />;
    if (error) return <ErrorMessage message={`שגיאה בטעינת הפורום: ${error.message}`} />;

    const topics = forumData?.topics || [];
    const totalPages = forumData?.totalPages || 0;

    if (selectedTopic) {
      return (
        <TopicThread 
          topicId={selectedTopic} 
          onBack={() => setSelectedTopic(null)}
          isModerator={isModerator}
          onDeleteTopic={handleDeleteTopic}
        />
      );
    }

    return (
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
          isModerator={isModerator}
          onDeleteTopic={handleDeleteTopic}
        />
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </>
    );
  };

  return (
    <div className={styles.forumContainer}>
      <h1 className={styles.forumTitle}>פורום קהילתי</h1>
      <ForumSearch onSearch={handleSearch} />
      {renderContent()}
    </div>
  );
};

export default React.memo(Forum);