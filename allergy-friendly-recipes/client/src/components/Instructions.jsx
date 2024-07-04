import React from 'react';

function Instructions({ instructions }) {
  return (
    <section className="instructions">
      <h3>הוראות הכנה:</h3>
      <p>{instructions}</p>
    </section>
  );
}

export default Instructions;