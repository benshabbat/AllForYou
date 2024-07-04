
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeals } from '../store/slices/mealSlice';

const AdminPage = () => {
  const dispatch = useDispatch();
  const { meals } = useSelector((state) => state.meals);

  useEffect(() => {
    dispatch(fetchMeals());
  }, [dispatch]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Manage Meals</h3>
      <ul>
        {meals.map((meal) => (
          <li key={meal._id}>
            <div>{meal.name}</div>
            <div>{meal.description}</div>
            {/* הוסף אפשרויות ניהול נוספות כמו עריכה ומחיקה */}
          </li>
        ))}
      </ul>
    </div>
  );
};