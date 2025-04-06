import PropTypes from 'prop-types';
import styles from './GeneralInfo.module.css';

const GeneralInfo = ({ info }) => (
  <section className={styles.generalInfo}>
    <h2>מידע כללי על אלרגיות מזון</h2>
    <div className={styles.infoGrid}>
      {info.map((item, index) => (
        <div key={index} className={styles.infoCard}>
          <div className={styles.infoIcon}>{item.icon}</div>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  </section>
);

GeneralInfo.propTypes = {
  info: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
    })
  ).isRequired,
};

export default GeneralInfo;