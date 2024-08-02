import React from 'react';
import PropTypes from 'prop-types';
import styles from './UserInfo.module.css';

function UserInfo({ user }) {
  return (
    <div className={styles.userInfo}>
      <h2 className={styles.username}>{user.username}</h2>
      <p className={styles.email}>אימייל: {user.email}</p>
      <p className={styles.joinDate}>הצטרף בתאריך: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}

UserInfo.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserInfo;