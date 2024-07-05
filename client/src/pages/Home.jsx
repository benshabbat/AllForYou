import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Home.module.css';

function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>ברוכים הבאים למתכונים לאלרגיים</h1>
        <p>מצאו את המתכונים המושלמים שמתאימים לצרכים התזונתיים שלכם</p>
        <Link to="/recipes" className={styles.ctaButton}>גלו מתכונים</Link>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <h2>חיפוש מתקדם</h2>
          <p>מצאו מתכונים לפי רכיבים, קטגוריות ואלרגנים</p>
        </div>
        <div className={styles.feature}>
          <h2>דירוג וביקורות</h2>
          <p>שתפו את החוויות שלכם ועזרו לאחרים למצוא את המתכונים הטובים ביותר</p>
        </div>
        <div className={styles.feature}>
          <h2>שיתוף מתכונים</h2>
          <p>הוסיפו את המתכונים האהובים עליכם ושתפו אותם עם הקהילה</p>
        </div>
      </section>

      {user ? (
        <section className={styles.userSection}>
          <h2>שלום, {user.username}!</h2>
          <p>מה תרצו לבשל היום?</p>
          <Link to="/add-recipe" className={styles.addRecipeButton}>הוסיפו מתכון חדש</Link>
        </section>
      ) : (
        <section className={styles.callToAction}>
          <h2>הצטרפו לקהילה שלנו</h2>
          <p>התחברו או הירשמו כדי להתחיל לשתף ולדרג מתכונים</p>
          <div className={styles.authButtons}>
            <Link to="/login" className={styles.loginButton}>התחברות</Link>
            <Link to="/register" className={styles.registerButton}>הרשמה</Link>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;