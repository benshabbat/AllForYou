import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">דף הבית</Link></li>
          <li><Link to="/recipes">מתכונים</Link></li>
          <li><Link to="/add-recipe">הוסף מתכון</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;