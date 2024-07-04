
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeals } from '../store/slices/mealSlice';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const { meals } = useSelector((state) => state.meals);

  useEffect(() => {
    dispatch(fetchMeals());
  }, [dispatch]);

  return (
    <div>
      <h1>Welcome to the Meal App</h1>
      <ul>
        {meals.map((meal) => (
          <li key={meal._id}>
            <Link to={`/meals/${meal._id}`}>{meal.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;