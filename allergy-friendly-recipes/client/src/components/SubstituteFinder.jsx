import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchMeals } from '../store/slices/mealSlice';

const SubstituteFinder = () => {
  const [ingredient, setIngredient] = useState('');
  const [substitute, setSubstitute] = useState('');
  const dispatch = useDispatch();

  const handleFindSubstitute = () => {
    dispatch(fetchMeals({ search: ingredient, sort: 'relevance' }));
    // כאן תוכל להוסיף את הלוגיקה למציאת תחליפים למרכיב
  };

  return (
    <div className="substitute-finder">
      <h2>Find a Substitute</h2>
      <input
        type="text"
        value={ingredient}
        onChange={(e) => setIngredient(e.target.value)}
        placeholder="Ingredient"
      />
      <input
        type="text"
        value={substitute}
        onChange={(e) => setSubstitute(e.target.value)}
        placeholder="Substitute"
      />
      <button onClick={handleFindSubstitute} className="pure-button pure-button-primary">
        Find Substitute
      </button>
    </div>
  );
};

export default SubstituteFinder;