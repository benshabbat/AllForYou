import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeals } from '../slices/mealSlice';
import AllergyFilter from './AllergyFilter';
import SubstituteFinder from './SubstituteFinder';

const MealList = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const dispatch = useDispatch();
  const { meals } = useSelector((state) => state.meals);

  useEffect(() => {
    dispatch(fetchMeals({ search, sort }));
  }, [search, sort, dispatch]);

  return (
    <div>
      <h2>Meal List</h2>
      <AllergyFilter />
      <SubstituteFinder />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search meals"
      />
      <select onChange={(e) => setSort(e.target.value)} value={sort}>
        <option value="">Sort By</option>
        <option value="asc">Name Ascending</option>
        <option value="desc">Name Descending</option>
      </select>
      <ul>
        {meals.map((meal) => (
          <li key={meal._id}>{meal.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MealList;