import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FaEdit, FaSave, FaTimes, FaUtensils, FaStar, FaHeart, FaHistory } from 'react-icons/fa';
import api from '../services/api';
import UserRecipes from '../components/UserRecipes';
import AllergenManagement from '../components/AllergenManagement';
import ActivityTimeline from '../components/ActivityTimeline';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  const { data: user, isLoading, error } = useQuery('userData', () =>
    api.get('/users/me').then(res => res.data)
  );

  const updateProfileMutation = useMutation(
    updatedUser => api.put('/users/profile', updatedUser),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userData');
        setIsEditing(false);
      }
    }
  );

  const handleEdit = () => {
    setEditedUser(user);
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editedUser);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({});
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  if (isLoading) return <div>טוען פרופיל...</div>;
  if (error) return <div>שגיאה בטעינת הפרופיל: {error.message}</div>;

  return (
    <div className={styles.profileContainer}>
      <section className={styles.userInfo}>
        <div className={styles.profileHeader}>
          <h1>{user.username}</h1>
          {!isEditing && (
            <button onClick={handleEdit} className={styles.editButton}>
              <FaEdit /> ערוך פרופיל
            </button>
          )}
        </div>
        {isEditing ? (
          <div className={styles.editForm}>
            <input
              type="text"
              name="username"
              value={editedUser.username}
              onChange={handleChange}
              placeholder="שם משתמש"
            />
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleChange}
              placeholder="אימייל"
            />
            <textarea
              name="bio"
              value={editedUser.bio}
              onChange={handleChange}
              placeholder="ספר לנו על עצמך"
            />
            <div className={styles.editActions}>
              <button onClick={handleSave} className={styles.saveButton}>
                <FaSave /> שמור
              </button>
              <button onClick={handleCancel} className={styles.cancelButton}>
                <FaTimes /> בטל
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.userDetails}>
            <p><strong>אימייל:</strong> {user.email}</p>
            <p><strong>הצטרף בתאריך:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            <p><strong>ביו:</strong> {user.bio || 'אין ביו עדיין'}</p>
          </div>
        )}
      </section>

      <section className={styles.userStats}>
        <div className={styles.statItem}>
          <FaUtensils />
          <span>{user.recipes?.length || 0}</span>
          <p>מתכונים</p>
        </div>
        <div className={styles.statItem}>
          <FaStar />
          <span>{user.averageRating?.toFixed(1) || 'N/A'}</span>
          <p>דירוג ממוצע</p>
        </div>
        <div className={styles.statItem}>
          <FaHeart />
          <span>{user.favorites?.length || 0}</span>
          <p>מועדפים</p>
        </div>
      </section>

      <AllergenManagement userId={user._id} />

      <section className={styles.userRecipes}>
        <h2>המתכונים שלי</h2>
        <UserRecipes userId={user._id} />
      </section>

      <section className={styles.activityTimeline}>
        <h2>היסטוריית פעילות</h2>
        <ActivityTimeline userId={user._id} />
      </section>
    </div>
  );
};

export default UserProfile;