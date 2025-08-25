import PropTypes from 'prop-types';
import styles from './AdditionalResources.module.css';
import { memo } from 'react';

const AdditionalResources = ({ resources }) => (
  <section className={styles.additionalResources}>
    <h2>משאבים נוספים</h2>
    <ul>
      {resources.map((resource, index) => (
        <li key={index}>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            {resource.title}
          </a>
        </li>
      ))}
    </ul>
  </section>
);

AdditionalResources.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default memo(AdditionalResources);