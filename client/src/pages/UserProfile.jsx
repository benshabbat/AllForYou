import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../store/slices/userSlice';
import { FaEdit, FaSave, FaTimes, FaUtensils, FaStar, FaHeart } from 'react-icons/fa';
import AllergenManagement from '../components/AllergenManagement';
import UserRecipes from '../components/UserRecipes';
import ActivityTimeline from '../components/ActivityTimeline';
import { useToast } from '../components/Toast';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const user = useSelector(state => state.auth.user);
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await dispatch(updateUserProfile(profile)).unwrap();
      addToast('פרופיל המשתמש עודכן בהצלחה', 'success');
      setIsEditing(false);
    } catch (error) {
      addToast('שגיאה בעדכון הפרופיל', 'error');
    }
  };

  return (
    <div className={styles.profileContainer}>
      <section className={styles.userInfo}>
        <div className={styles.profileHeader}>
          <h1>{user.username}</h1>
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
        {isEditing ? (
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

      <section className={styles.allergenSection}>
        <h2>אלרגנים</h2>
        <AllergenManagement />
      </section>

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