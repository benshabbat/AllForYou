import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div className="app-layout">
      {/* כותרת עליונה */}
      <header>
        <h1>מתכונים ידידותיים לאלרגיות</h1>
        {/* תפריט ניווט */}
        <nav>
          <ul>
            <li><Link to="/">בית</Link></li>
            <li><Link to="/add-recipe">הוסף מתכון</Link></li>
          </ul>
        </nav>
      </header>

      {/* תוכן עיקרי - יוחלף על ידי הקומפוננטות של הנתיבים השונים */}
      <main>
        <Outlet />
      </main>

      {/* כותרת תחתונה */}
      <footer>
        <p>© 2024 מתכונים ידידותיים לאלרגיות. כל הזכויות שמורות.</p>
      </footer>
    </div>
  );
}

export default Layout;