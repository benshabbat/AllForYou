import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">דף הבית</Link></li>
          <li><Link to="/recipes">מתכונים</Link></li>
          <li><Link to="/add-recipe">הוסף מתכון</Link></li>
          {user ? (
            <li><button onClick={handleLogout}>התנתק</button></li>
          ) : (
            <>
              <li><Link to="/login">התחבר</Link></li>
              <li><Link to="/register">הרשם</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;