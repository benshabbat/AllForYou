import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchMeals } from '../store/slices/mealSlice';

const AllergyFilter = () => {
  const [allergies, setAllergies] = useState([]);
  const dispatch = useDispatch();

  const handleFilterChange = (e) => {
    const selectedAllergies = Array.from(e.target.selectedOptions, option => option.value);
    setAllergies(selectedAllergies);
    dispatch(fetchMeals({ search: '', sort: 'relevance', allergies: selectedAllergies }));
  };

  return (
    <div className="allergy-filter">
      <h2>Filter by Allergy</h2>
      <select multiple onChange={handleFilterChange}>
        <option value="gluten">Gluten</option>
        <option value="nuts">Nuts</option>
        <option value="dairy">Dairy</option>
        <option value="shellfish">Shellfish</option>
        {/* הוסף כאן אפשרויות נוספות לפי הצורך */}
      </select>
    </div>
  );
};

export default AllergyFilter;