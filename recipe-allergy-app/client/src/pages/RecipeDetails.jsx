import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getRecipeById } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

const RecipeDetails = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching the recipe');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorMessage message={error} />;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="recipe-details">
      <h1>{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} />
      <h2>Ingredients:</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2>Instructions:</h2>
      <ol>
        {recipe.instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
      <h2>Allergens:</h2>
      <p>{recipe.allergens.join(', ')}</p>
      {userInfo && userInfo._id === recipe.author && (
        <Link to={`/edit-recipe/${recipe._id}`}>Edit Recipe</Link>
      )}
    </div>
  );
};

export default RecipeDetails;