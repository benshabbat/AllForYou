import React from 'react';
import { Link } from 'react-router-dom';

// Home component - דף הבית של האפליקציה
function Home() {
  return (
    <div className="home">
      <h1>ברוכים הבאים לאפליקציית המתכונים לאלרגיים</h1>
      <nav>
        <ul>
          <li><Link to="/recipes">צפייה במתכונים</Link></li>
          <li><Link to="/add-recipe">הוספת מתכון חדש</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;