import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FaEdit, FaSave, FaTimes, FaUtensils, FaStar, FaHeart } from 'react-icons/fa';
import { fetchUserProfile, updateUserProfile, fetchUserRecipes } from '../utils/apiUtils';
import AllergenManagement from '../components/AllergenManagement';
import UserRecipes from '../components/UserRecipes';
import ActivityTimeline from '../components/ActivityTimeline';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const user = useSelector(state => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery(
    'userProfile',
    fetchUserProfile,
    {
      enabled: !!user,
      initialData: user
    }
  );

  const { data: userRecipes, isLoading: recipesLoading, error: recipesError } = useQuery(
    ['userRecipes', user?.id],
    () => fetchUserRecipes(user.id),
    { enabled: !!user?.id }
  );

  const updateProfileMutation = useMutation(updateUserProfile, {
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData('userProfile', updatedProfile);
      addToast('פרופיל המשתמש עודכן בהצלחה', 'success');
      setIsEditing(false);
    },
    onError: (error) => {
      addToast(`שגיאה בעדכון הפרופיל: ${error.message}`, 'error');
    }
  });

  const handleProfileChange = useCallback((e) => {
    const { name, value } = e.target;
    queryClient.setQueryData('userProfile', old => ({ ...old, [name]: value }));
  }, [queryClient]);

  const handleSubmit = useCallback(async () => {
    const updatedProfile = queryClient.getQueryData('userProfile');
    updateProfileMutation.mutate(updatedProfile);
  }, [queryClient, updateProfileMutation]);

  if (profileLoading || recipesLoading) return <Loading message="טוען פרופיל משתמש..." />;
  if (profileError || recipesError) return <ErrorMessage message="שגיאה בטעינת פרופיל המשתמש" />;

  const renderProfileHeader = () => (
    <div className={styles.profileHeader}>
      <h1>{profile.username}</h1>
      {!isEditing ? (
        <button onClick={() => setIsEditing(true)} className={styles.editButton}>
          <FaEdit /> ערוך פרופיל
        </button>
      ) : (
        <>
          <button onClick={handleSubmit} className={styles.saveButton}>
            <FaSave /> שמור שינויים
          </button>
          <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>
            <FaTimes /> בטל
          </button>
        </>
      )}
    </div>
  );

  const renderProfileForm = () => (
    <div className={styles.editForm}>
      <input
        type="text"
        name="username"
        value={profile.username}
        onChange={handleProfileChange}
        placeholder="שם משתמש"
        className={styles.input}
        disabled={!isEditing}
      />
      <input
        type="email"
        name="email"
        value={profile.email}
        onChange={handleProfileChange}
        placeholder="אימייל"
        className={styles.input}
        disabled={!isEditing}
      />
      <textarea
        name="bio"
        value={profile.bio}
        onChange={handleProfileChange}
        placeholder="ספר לנו על עצמך"
        className={styles.textarea}
        disabled={!isEditing}
      />
    </div>
  );

  const renderProfileDetails = () => (
    <div className={styles.userDetails}>
      <p><strong>אימייל:</strong> {profile.email}</p>
      <p><strong>הצטרף בתאריך:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
      <p><strong>ביו:</strong> {profile.bio || 'אין ביו עדיין'}</p>
    </div>
  );

  const renderUserStats = () => (
    <section className={styles.userStats}>
      <div className={styles.statItem}>
        <FaUtensils />
        <span>{userRecipes?.length || 0}</span>
        <p>מתכונים</p>
      </div>
      <div className={styles.statItem}>
        <FaStar />
        <span>{profile.averageRating?.toFixed(1) || 'N/A'}</span>
        <p>דירוג ממוצע</p>
      </div>
      <div className={styles.statItem}>
        <FaHeart />
        <span>{profile.favorites?.length || 0}</span>
        <p>מועדפים</p>
      </div>
    </section>
  );

  return (
    <div className={styles.profileContainer}>
      <section className={styles.userInfo}>
        {renderProfileHeader()}
        {isEditing ? renderProfileForm() : renderProfileDetails()}
      </section>

      {renderUserStats()}

      <section className={styles.allergenSection}>
        <h2>אלרגנים</h2>
        <AllergenManagement />
      </section>

      <section className={styles.userRecipes}>
        <h2>המתכונים שלי</h2>
        <UserRecipes recipes={userRecipes} />
      </section>

      <section className={styles.activityTimeline}>
        <h2>היסטוריית פעילות</h2>
        <ActivityTimeline userId={user._id} />
      </section>
    </div>
  );
};

export default React.memo(UserProfile);