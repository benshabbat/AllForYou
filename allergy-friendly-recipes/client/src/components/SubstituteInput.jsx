import React from 'react';

function SubstituteInput({ substitutes, onChange, onAdd }) {
  return (
    <div className="substitute-input">
      <h4>תחליפים:</h4>
      {substitutes.map((sub, index) => (
        <div key={index} className="substitute-item">
          <input
            type="text"
            value={sub.ingredient}
            onChange={(e) => onChange(index, 'ingredient', e.target.value)}
            placeholder="מרכיב"
          />
          <input
            type="text"
            value={Array.isArray(sub.alternatives) ? sub.alternatives.join(', ') : sub.alternatives}
            onChange={(e) => onChange(index, 'alternatives', e.target.value)}
            placeholder="תחליפים (מופרדים בפסיקים)"
          />
          <button type="button" onClick={() => onChange(index, 'remove')}>הסר</button>
        </div>
      ))}
      <button type="button" onClick={onAdd} className="add-substitute">הוסף תחליף</button>
    </div>
  );
}

export default SubstituteInput;