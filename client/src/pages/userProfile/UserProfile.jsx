import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { FaEdit, FaSave, FaTimes, FaUtensils, FaStar, FaHeart } from 'react-icons/fa';
import { fetchUserProfile, updateUserProfile, fetchUserRecipes } from '../../utils/apiUtils';
import AllergenManagement from '../../components/allergenManagement/AllergenManagement';
import UserRecipes from '../../components/userRecipes/UserRecipes';
import ActivityTimeline from '../../components/activityTimeLine/ActivityTimeline';
import {Loading,useToast} from '../../components/common';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
import styles from './UserProfile.module.css';
import UserInfo from '../../components/user/userInfo/UserInfo';

const UserProfile = () => {
  const { user: authUser } = useSelector(state => state.auth);
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isLoading: userLoading, error: userError } = useQuery(
    'userProfile',
    fetchUserProfile,
    { enabled: !!authUser }
  );

  const { data: userRecipes, isLoading: recipesLoading, error: recipesError } = useQuery(
    ['userRecipes', authUser?.id],
    () => fetchUserRecipes(authUser.id),
    { enabled: !!authUser }
  );

  const updateProfileMutation = useMutation(updateUserProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries('userProfile');
      addToast('פרופיל המשתמש עודכן בהצלחה', 'success');
      setIsEditing(false);
    },
    onError: (error) => {
      addToast(`שגיאה בעדכון הפרופיל: ${error.message}`, 'error');
    },
  });

  const [profile, setProfile] = useState({
    username: '',
    email: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleProfileChange = useCallback((e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    updateProfileMutation.mutate(profile);
  }, [updateProfileMutation, profile]);

  const renderProfileHeader = () => (
    <div className={styles.profileHeader}>
      <h1>{user?.username}</h1>
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
      />
      <input
        type="email"
        name="email"
        value={profile.email}
        onChange={handleProfileChange}
        placeholder="אימייל"
        className={styles.input}
      />
      <textarea
        name="bio"
        value={profile.bio}
        onChange={handleProfileChange}
        placeholder="ספר לנו על עצמך"
        className={styles.textarea}
      />
    </div>
  );

  const renderProfileDetails = () => (
    <div className={styles.userDetails}>
      <p><strong>אימייל:</strong> {user?.email}</p>
      <p><strong>הצטרף בתאריך:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
      <p><strong>ביו:</strong> {user?.bio || 'אין ביו עדיין'}</p>
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
        <span>{user?.averageRating?.toFixed(1) || 'N/A'}</span>
        <p>דירוג ממוצע</p>
      </div>
      <div className={styles.statItem}>
        <FaHeart />
        <span>{user?.favorites?.length || 0}</span>
        <p>מועדפים</p>
      </div>
    </section>
  );

  if (userLoading || recipesLoading) return <Loading message="טוען פרופיל משתמש..." />;
  if (userError || recipesError) return <ErrorMessage message="שגיאה בטעינת פרופיל המשתמש" />;

  return (
    <div className={styles.profileContainer}>
      <section className={styles.userInfo}>
        {renderProfileHeader()}
        {isEditing ? renderProfileForm() : <UserInfo user={user}/>}
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
        <ActivityTimeline userId={user?._id} />
      </section>
    </div>
  );
};

export default React.memo(UserProfile);