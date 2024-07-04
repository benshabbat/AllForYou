import React from 'react';

function Substitutions({ substitutions }) {
  return (
    <section className="substitutions">
      <h3>תחליפים:</h3>
      <ul>
        {substitutions.map((sub, index) => (
          <li key={index}>
            {sub.ingredient}: {sub.alternatives.join(', ')}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Substitutions;