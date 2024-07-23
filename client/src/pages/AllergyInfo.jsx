import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';
import AllergenDetails from '../components/AllergenDetails';
import { FaInfoCircle, FaExclamationTriangle, FaChartBar, FaClipboardList } from 'react-icons/fa';
import styles from './AllergyInfo.module.css';

const AllergyInfo = () => {
  const [selectedAllergen, setSelectedAllergen] = useState(null);
  const { data: allergens, isLoading, error } = useQuery('allergens', () =>
    api.get('/allergens').then(res => res.data)
  );

  const generalInfo = [
    {
      title: "מהי אלרגיה למזון?",
      content: "אלרגיה למזון היא תגובה חיסונית חריגה לחלבונים מסוימים במזון. התגובה יכולה לנוע מקלה עד חמורה ומסכנת חיים.",
      icon: <FaInfoCircle />
    },
    {
      title: "סטטיסטיקות",
      content: "כ-5% מהמבוגרים וכ-8% מהילדים סובלים מאלרגיות מזון. האלרגיות הנפוצות ביותר הן לבוטנים, אגוזי עץ, חלב, ביצים ודגים.",
      icon: <FaChartBar />
    },
    {
      title: "טיפים להתמודדות",
      content: "קראו תוויות מזון בקפידה, הימנעו מחשיפה לאלרגנים, שאו אפיפן במקרה הצורך, והיוועצו עם רופא או תזונאי לגבי תחליפים מתאימים.",
      icon: <FaClipboardList />
    }
  ];

  if (isLoading) return <div className={styles.loading}>טוען מידע על אלרגנים...</div>;
  if (error) return <div className={styles.error}>שגיאה בטעינת מידע: {error.message}</div>;

  return (
    <div className={styles.allergyInfoContainer}>
      <h1 className={styles.mainTitle}>מידע על אלרגיות מזון</h1>
      
      <section className={styles.generalInfo}>
        <h2>מידע כללי על אלרגיות מזון</h2>
        <div className={styles.infoGrid}>
          {generalInfo.map((info, index) => (
            <div key={index} className={styles.infoCard}>
              <div className={styles.infoIcon}>{info.icon}</div>
              <h3>{info.title}</h3>
              <p>{info.content}</p>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.infoBox}>
        <FaExclamationTriangle className={styles.warningIcon} />
        <p>חשוב לזכור: אלרגיות מזון יכולות להיות מסכנות חיים. תמיד התייעצו עם רופא מומחה לאבחון וטיפול מתאים.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.allergenList}>
          <h2>רשימת אלרגנים נפוצים</h2>
          <ul>
            {allergens.map(allergen => (
              <li 
                key={allergen._id} 
                className={selectedAllergen === allergen._id ? styles.selected : ''}
                onClick={() => setSelectedAllergen(allergen._id)}
              >
                {allergen.icon && <span className={styles.allergenIcon}>{allergen.icon}</span>}
                {allergen.hebrewName}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.allergenDetails}>
          {selectedAllergen ? (
            <AllergenDetails allergenId={selectedAllergen} />
          ) : (
            <div className={styles.noSelection}>
              <FaInfoCircle className={styles.infoIcon} />
              <p>בחר אלרגן מהרשימה כדי לראות מידע מפורט</p>
            </div>
          )}
        </div>
      </div>

      <section className={styles.additionalResources}>
        <h2>משאבים נוספים</h2>
        <ul>
          <li><a href="#" target="_blank" rel="noopener noreferrer">מדריך לקריאת תוויות מזון</a></li>
          <li><a href="#" target="_blank" rel="noopener noreferrer">מתכונים ללא אלרגנים נפוצים</a></li>
          <li><a href="#" target="_blank" rel="noopener noreferrer">קבוצות תמיכה לאנשים עם אלרגיות מזון</a></li>
        </ul>
      </section>
    </div>
  );
};

export default AllergyInfo;