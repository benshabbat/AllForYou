import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAllergenPreferences, updateUserProfile, changePassword } from '../store/slices/userSlice';
import { fetchAllergens } from '../store/slices/allergenSlice';
import AllergenIcon from '../components/AllergenIcon';
import { FaUser, FaPalette, FaBell, FaLock, FaSave, FaTimes } from 'react-icons/fa';
import { useToast } from '../components/Toast';
import styles from './UserSettings.module.css';

const UserSettings = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const user = useSelector(state => state.auth.user);
  const allergens = useSelector(state => state.allergens.allergens);
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchAllergens());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.allergenPreferences) {
      setSelectedAllergens(user.allergenPreferences);
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAllergenToggle = (allergenId) => {
    setSelectedAllergens(prev => 
      prev.includes(allergenId)
        ? prev.filter(id => id !== allergenId)
        : [...prev, allergenId]
    );
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await dispatch(updateUserProfile(profile)).unwrap();
      await dispatch(updateUserAllergenPreferences(selectedAllergens)).unwrap();
      // Here you would also update theme and notifications on the server
      addToast('הגדרות המשתמש עודכנו בהצלחה', 'success');
      setIsEditing(false);
    } catch (error) {
      addToast('שגיאה בעדכון ההגדרות', 'error');
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      addToast('הסיסמאות החדשות אינן תואמות', 'error');
      return;
    }
    try {
      await dispatch(changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })).unwrap();
      addToast('הסיסמה שונתה בהצלחה', 'success');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      addToast(error || 'שגיאה בשינוי הסיסמה', 'error');
    }
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
        placeholder="ספר לנו קצת על עצמך"
        className={styles.textarea}
        disabled={!isEditing}
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
            disabled={!isEditing}
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
          disabled={!isEditing}
        >
          בהיר
        </button>
        <button
          onClick={() => handleThemeChange('dark')}
          className={`${styles.themeButton} ${theme === 'dark' ? styles.activeTheme : ''}`}
          disabled={!isEditing}
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
            disabled={!isEditing}
          />
          <span className={styles.slider}></span>
          התראות אימייל
        </label>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={notifications.push}
            onChange={() => handleNotificationChange('push')}
            disabled={!isEditing}
          />
          <span className={styles.slider}></span>
          התראות דחיפה
        </label>
      </div>
    </div>
  );

  const renderPasswordSettings = () => (
    <div className={styles.settingsSection}>
      <h3>שינוי סיסמה</h3>
      <input
        type="password"
        name="currentPassword"
        value={passwords.currentPassword}
        onChange={handlePasswordChange}
        placeholder="סיסמה נוכחית"
        className={styles.input}
      />
      <input
        type="password"
        name="newPassword"
        value={passwords.newPassword}
        onChange={handlePasswordChange}
        placeholder="סיסמה חדשה"
        className={styles.input}
      />
      <input
        type="password"
        name="confirmPassword"
        value={passwords.confirmPassword}
        onChange={handlePasswordChange}
        placeholder="אימות סיסמה חדשה"
        className={styles.input}
      />
      <button onClick={handlePasswordSubmit} className={styles.passwordButton}>
        שנה סיסמה
      </button>
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
        <button onClick={() => setActiveTab('password')} className={`${styles.tabButton} ${activeTab === 'password' ? styles.activeTab : ''}`}>
          <FaLock /> סיסמה
        </button>
      </div>
      <div className={styles.settingsContent}>
        {activeTab === 'profile' && renderProfileSettings()}
        {activeTab === 'allergens' && renderAllergenSettings()}
        {activeTab === 'theme' && renderThemeSettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'password' && renderPasswordSettings()}
      </div>
      {activeTab !== 'password' && (
        <div className={styles.actionButtons}>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className={styles.editButton}>
              <FaUser /> ערוך הגדרות
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
      )}
    </div>
  );
};

export default UserSettings;