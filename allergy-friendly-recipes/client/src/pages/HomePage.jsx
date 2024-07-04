import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeals } from '../store/slices/mealSlice';
import AllergyFilter from '../components/AllergyFilter';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const { meals, status, error } = useSelector((state) => state.meals);

  useEffect(() => {
    dispatch(fetchMeals());
  }, [dispatch]);

  return (
    <div>
      <h1>Welcome to the Meal App</h1>
      <AllergyFilter />
      <ul>
        {status === 'loading' && <p>Loading meals...</p>}
        {status === 'failed' && <p>Error: {error}</p>}
        {status === 'succeeded' && meals.map((meal) => (
          <li key={meal._id}>
            <Link to={`/meals/${meal._id}`}>{meal.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;