import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchMeals } from '../slices/mealSlice';

const AllergyFilter = () => {
  const [allergy, setAllergy] = useState('');
  const dispatch = useDispatch();

  const handleFilter = () => {
    dispatch(fetchMeals({ allergy }));
  };

  return (
    <div>
      <input
        type="text"
        value={allergy}
        onChange={(e) => setAllergy(e.target.value)}
        placeholder="Filter by allergy"
      />
      <button onClick={handleFilter} className="pure-button pure-button-primary">
        Filter
      </button>
    </div>
  );
};

export default AllergyFilter;