import React, { useState } from 'react';
import api from '../services/api';

const SubstituteFinder = () => {
  const [ingredient, setIngredient] = useState('');
  const [substitutes, setSubstitutes] = useState([]);

  const handleFindSubstitutes = async () => {
    try {
      const response = await api.get('/meals/substitutes', {
        params: { ingredient },
      });
      setSubstitutes(response.data);
    } catch (error) {
      console.error('Error fetching substitutes:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={ingredient}
        onChange={(e) => setIngredient(e.target.value)}
        placeholder="Enter ingredient"
      />
      <button onClick={handleFindSubstitutes} className="pure-button pure-button-primary">
        Find Substitutes
      </button>
      <ul>
        {substitutes.map((sub, index) => (
          <li key={index}>{sub}</li>
        ))}
      </ul>
    </div>
  );
};

export default SubstituteFinder;