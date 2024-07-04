
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeals } from '../store/slices/mealSlice';
import SubstituteFinder from '../components/SubstituteFinder';

const MealPage = () => {
  const { mealId } = useParams();
  const dispatch = useDispatch();
  const { meals } = useSelector((state) => state.meals);
  const meal = meals.find((meal) => meal._id === mealId);

  useEffect(() => {
    dispatch(fetchMeals());
  }, [dispatch]);

  if (!meal) return <p>Loading...</p>;

  return (
    <div>
      <h2>{meal.name}</h2>
      <p>{meal.description}</p>
      <SubstituteFinder />
    </div>
  );
};

export default MealPage;