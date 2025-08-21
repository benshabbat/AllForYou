import PropTypes from 'prop-types';
import styles from './GeneralInfo.module.css';

const GeneralInfo = ({ info }) => (
  <div className={styles.generalInfo}>
    {Array.isArray(info) ? (
      info.map((item, index) => (
        <div key={index} className={styles.infoItem}>
          <h2>
            <div className={styles.icon}>{item.icon}</div>
            {item.title}
          </h2>
          <p>{item.content}</p>
        </div>
      ))
    ) : (
      <div className={styles.infoItem}>
        <h2>
          <div className={styles.icon}>{info.icon}</div>
          {info.title}
        </h2>
        <p>{info.content}</p>
      </div>
    )}
  </div>
);

GeneralInfo.propTypes = {
  info: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        icon: PropTypes.node,
      })
    ),
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      icon: PropTypes.node,
    }),
  ]).isRequired,
};

export default GeneralInfo;