import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getRecipeById, updateRecipe } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

const EditRecipe = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [allergens, setAllergens] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipe = await getRecipeById(id);
        setTitle(recipe.title);
        setIngredients(recipe.ingredients.join(', '));
        setInstructions(recipe.instructions.join('\n'));
        setAllergens(recipe.allergens.join(', '));
        setImage(recipe.image);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching the recipe');
      }
    };

    fetchRecipe();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      setError('You must be logged in to edit a recipe');
      return;
    }
    try {
      await updateRecipe(id, {
        title,
        ingredients: ingredients.split(',').map(i => i.trim()),
        instructions: instructions.split('\n'),
        allergens: allergens.split(',').map(a => a.trim()),
        image
      });
      navigate(`/recipe/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating the recipe');
    }
  };

  if (!userInfo) return <ErrorMessage message="You must be logged in to edit recipes" />;

  return (
    <div>
      <h1>Edit Recipe</h1>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="ingredients">Ingredients (comma separated):</label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="instructions">Instructions (each step on a new line):</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="allergens">Allergens (comma separated):</label>
          <input
            type="text"
            id="allergens"
            value={allergens}
            onChange={(e) => setAllergens(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <button type="submit">Update Recipe</button>
      </form>
    </div>
  );
};

export default EditRecipe;