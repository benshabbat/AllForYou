import React from 'react';

function AllergenInfo({ allergens }) {
  return (
    <section className="allergen-info">
      <h3>אלרגנים:</h3>
      <p>{allergens.length > 0 ? allergens.join(', ') : 'אין אלרגנים'}</p>
    </section>
  );
}

export default AllergenInfo;