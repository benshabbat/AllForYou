import React from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';
import { FaExclamationCircle, FaBan, FaCheckCircle } from 'react-icons/fa';
import styles from './AllergenDetails.module.css';

const AllergenDetails = ({ allergenId }) => {
  const { data: allergen, isLoading, error } = useQuery(['allergen', allergenId], () =>
    api.get(`/allergens/${allergenId}`).then(res => res.data)
  );

  if (isLoading) return <div className={styles.loading}>טוען פרטי אלרגן...</div>;
  if (error) return <div className={styles.error}>שגיאה בטעינת פרטי אלרגן: {error.message}</div>;

  return (
    <div className={styles.allergenDetails}>
      <h2>{allergen.hebrewName} ({allergen.name})</h2>
      <p className={styles.description}>{allergen.description}</p>
      
      <div className={styles.section}>
        <h3><FaExclamationCircle /> תסמינים נפוצים</h3>
        <ul className={styles.symptomsList}>
          {allergen.symptoms.map((symptom, index) => (
            <li key={index}>{symptom}</li>
          ))}
        </ul>
      </div>
      
      <div className={styles.section}>
        <h3><FaBan /> מזונות להימנע מהם</h3>
        <ul className={styles.avoidList}>
          {allergen.avoidList.map((food, index) => (
            <li key={index}>{food}</li>
          ))}
        </ul>
      </div>
      
      <div className={styles.section}>
        <h3><FaCheckCircle /> חלופות מומלצות</h3>
        <ul className={styles.alternativesList}>
          {allergen.alternatives.map((alt, index) => (
            <li key={index}>
              <strong>{alt.name}</strong>: {alt.description}
            </li>
          ))}
        </ul>
      </div>
      
      <div className={styles.severityInfo}>
        <h3>רמת חומרה</h3>
        <span className={`${styles.severity} ${styles[allergen.severity.toLowerCase()]}`}>
          {allergen.severity}
        </span>
      </div>
      
      <div className={styles.tips}>
        <h3>טיפים להתמודדות</h3>
        <ul>
          <li>קראו תוויות מזון בקפידה</li>
          <li>הודיעו למסעדות על האלרגיה שלכם בעת הזמנה</li>
          <li>שאו עמכם תרופות אנטי-היסטמיניות או אפיפן במקרה הצורך</li>
          <li>התייעצו עם דיאטנית לגבי תחליפים מתאימים</li>
        </ul>
      </div>
    </div>
  );
};

export default AllergenDetails;