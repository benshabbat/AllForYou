import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMeal } from '../store/slices/mealSlice';

const AddMealPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [allergies, setAllergies] = useState([]);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addMeal({ name, description, allergies }));
  };

  return (
    <div>
      <h2>Add New Meal</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Meal Name"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="text"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value.split(','))}
          placeholder="Allergies (comma separated)"
        />
        <button type="submit" className="pure-button pure-button-primary">
          Add Meal
        </button>
      </form>
    </div>
  );
};

export default AddMealPage;