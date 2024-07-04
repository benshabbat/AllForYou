import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeals } from '../slices/mealSlice';

const MealList = () => {
  const dispatch = useDispatch();
  const meals = useSelector((state) => state.meal.meals);
  const mealStatus = useSelector((state) => state.meal.status);

  useEffect(() => {
    if (mealStatus === 'idle') {
      dispatch(fetchMeals());
    }
  }, [mealStatus, dispatch]);

  return (
    <div className="pure-g">
      {meals.map((meal) => (
        <div key={meal._id} className="pure-u-1 pure-u-md-1-3">
          <div className="meal-card">
            <h2>{meal.name}</h2>
            <p>Ingredients: {meal.ingredients.join(', ')}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MealList;