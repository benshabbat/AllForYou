import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAllergenPreferences, updateUserProfile } from '../store/slices/userSlice';
import { fetchAllergens } from '../store/slices/allergenSlice';
import AllergenIcon from '../components/AllergenIcon';
import { FaUser, FaPalette, FaBell, FaLock } from 'react-icons/fa';
import styles from './UserSettings.module.css';

const UserSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const allergens = useSelector(state => state.allergens.allergens);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  useEffect(() => {
    dispatch(fetchAllergens());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.allergenPreferences) {
      setSelectedAllergens(user.allergenPreferences);
    }
  }, [user]);

  const handleAllergenToggle = (allergenId) => {
    setSelectedAllergens(prev => 
      prev.includes(allergenId)
        ? prev.filter(id => id !== allergenId)
        : [...prev, allergenId]
    );
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserAllergenPreferences(selectedAllergens));
    dispatch(updateUserProfile(profile));
    // Here you would also update theme and notifications on the server
  };

  const renderProfileSettings = () => (
    <div className={styles.settingsSection}>
      <h3>הגדרות פרופיל</h3>
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
        placeholder="ספר לנו קצת על עצמך"
        className={styles.textarea}
      />
    </div>
  );

  const renderAllergenSettings = () => (
    <div className={styles.settingsSection}>
      <h3>העדפות אלרגנים</h3>
      <div className={styles.allergenList}>
        {allergens.map(allergen => (
          <button
            key={allergen._id}
            type="button"
            onClick={() => handleAllergenToggle(allergen._id)}
            className={`${styles.allergenButton} ${
              selectedAllergens.includes(allergen._id) ? styles.selected : ''
            }`}
          >
            <AllergenIcon allergen={allergen} />
            <span>{allergen.hebrewName}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderThemeSettings = () => (
    <div className={styles.settingsSection}>
      <h3>הגדרות עיצוב</h3>
      <div className={styles.themeButtons}>
        <button
          onClick={() => handleThemeChange('light')}
          className={`${styles.themeButton} ${theme === 'light' ? styles.activeTheme : ''}`}
        >
          בהיר
        </button>
        <button
          onClick={() => handleThemeChange('dark')}
          className={`${styles.themeButton} ${theme === 'dark' ? styles.activeTheme : ''}`}
        >
          כהה
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className={styles.settingsSection}>
      <h3>הגדרות התראות</h3>
      <div className={styles.notificationOptions}>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={notifications.email}
            onChange={() => handleNotificationChange('email')}
          />
          <span className={styles.slider}></span>
          התראות אימייל
        </label>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={notifications.push}
            onChange={() => handleNotificationChange('push')}
          />
          <span className={styles.slider}></span>
          התראות דחיפה
        </label>
      </div>
    </div>
  );

  return (
    <div className={styles.userSettings}>
      <h2>הגדרות משתמש</h2>
      <div className={styles.tabContainer}>
        <button onClick={() => setActiveTab('profile')} className={`${styles.tabButton} ${activeTab === 'profile' ? styles.activeTab : ''}`}>
          <FaUser /> פרופיל
        </button>
        <button onClick={() => setActiveTab('allergens')} className={`${styles.tabButton} ${activeTab === 'allergens' ? styles.activeTab : ''}`}>
          <FaLock /> אלרגנים
        </button>
        <button onClick={() => setActiveTab('theme')} className={`${styles.tabButton} ${activeTab === 'theme' ? styles.activeTab : ''}`}>
          <FaPalette /> עיצוב
        </button>
        <button onClick={() => setActiveTab('notifications')} className={`${styles.tabButton} ${activeTab === 'notifications' ? styles.activeTab : ''}`}>
          <FaBell /> התראות
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {activeTab === 'profile' && renderProfileSettings()}
        {activeTab === 'allergens' && renderAllergenSettings()}
        {activeTab === 'theme' && renderThemeSettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        <button type="submit" className={styles.submitButton}>שמור שינויים</button>
      </form>
    </div>
  );
};

export default UserSettings;