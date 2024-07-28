import React, { useReducer } from 'react';
import { useUser } from '../hooks/useUser';
import styles from './UserSettings.module.css';

const initialState = {
  theme: 'light',
  notifications: {
    email: false,
    push: false,
  },
};

function settingsReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'TOGGLE_NOTIFICATION':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [action.payload]: !state.notifications[action.payload],
        },
      };
    default:
      return state;
  }
}

const UserSettings = () => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const { updateUserSettings } = useUser();

  const handleSave = () => {
    updateUserSettings(state);
  };

  return (
    <div className={styles.settings}>
      <h2>הגדרות משתמש</h2>
      <div>
        <label>
          ערכת נושא:
          <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
            {state.theme === 'light' ? 'בהיר' : 'כהה'}
          </button>
        </label>
      </div>
      <div>
        <h3>התראות:</h3>
        <label>
          <input
            type="checkbox"
            checked={state.notifications.email}
            onChange={() => dispatch({ type: 'TOGGLE_NOTIFICATION', payload: 'email' })}
          />
          אימייל
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.notifications.push}
            onChange={() => dispatch({ type: 'TOGGLE_NOTIFICATION', payload: 'push' })}
          />
          התראות דחיפה
        </label>
      </div>
      <button onClick={handleSave}>שמור הגדרות</button>
    </div>
  );
};

export default UserSettings;