import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { fetchAllergens } from '../utils/apiUtils';
import AllergenDetails from '../components/AllergenDetails';
import { FaInfoCircle, FaExclamationTriangle, FaChartBar, FaClipboardList } from 'react-icons/fa';
import {Loading} from '../components/common';
import ErrorMessage from '../components/ErrorMessage';
import styles from './AllergyInfo.module.css';

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

const additionalResources = [
  { title: "מדריך לקריאת תוויות מזון", url: "#" },
  { title: "מתכונים ללא אלרגנים נפוצים", url: "#" },
  { title: "קבוצות תמיכה לאנשים עם אלרגיות מזון", url: "#" }
];

const AllergyInfo = () => {
  const [selectedAllergen, setSelectedAllergen] = useState(null);
  const { data: allergens, isLoading, error } = useQuery('allergens', fetchAllergens);

  const handleAllergenSelect = useCallback((allergenId) => {
    setSelectedAllergen(allergenId);
  }, []);

  const renderGeneralInfo = () => (
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
  );

  const renderWarningBox = () => (
    <div className={styles.infoBox}>
      <FaExclamationTriangle className={styles.warningIcon} />
      <p>חשוב לזכור: אלרגיות מזון יכולות להיות מסכנות חיים. תמיד התייעצו עם רופא מומחה לאבחון וטיפול מתאים.</p>
    </div>
  );

  const renderAllergenList = () => (
    <div className={styles.allergenList}>
      <h2>רשימת אלרגנים נפוצים</h2>
      <ul>
        {allergens?.map(allergen => (
          <li 
            key={allergen._id} 
            className={selectedAllergen === allergen._id ? styles.selected : ''}
            onClick={() => handleAllergenSelect(allergen._id)}
          >
            {allergen.icon && <span className={styles.allergenIcon}>{allergen.icon}</span>}
            {allergen.hebrewName}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderAllergenDetails = () => (
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
  );

  const renderAdditionalResources = () => (
    <section className={styles.additionalResources}>
      <h2>משאבים נוספים</h2>
      <ul>
        {additionalResources.map((resource, index) => (
          <li key={index}>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a>
          </li>
        ))}
      </ul>
    </section>
  );

  if (isLoading) return <Loading message="טוען מידע על אלרגנים..." />;
  if (error) return <ErrorMessage message={`שגיאה בטעינת מידע: ${error.message}`} />;

  return (
    <div className={styles.allergyInfoContainer}>
      <h1 className={styles.mainTitle}>מידע על אלרגיות מזון</h1>
      
      {renderGeneralInfo()}
      {renderWarningBox()}

      <div className={styles.content}>
        {renderAllergenList()}
        {renderAllergenDetails()}
      </div>

      {renderAdditionalResources()}
    </div>
  );
};

export default React.memo(AllergyInfo);