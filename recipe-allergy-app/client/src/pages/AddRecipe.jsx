import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { addRecipe } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [allergens, setAllergens] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      setError('You must be logged in to add a recipe');
      return;
    }
    try {
      await addRecipe({
        title,
        ingredients: ingredients.split(',').map(i => i.trim()),
        instructions: instructions.split('\n'),
        allergens: allergens.split(',').map(a => a.trim()),
        image
      });
      navigate('/recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while adding the recipe');
    }
  };

  return (
    <div>
      <h1>Add New Recipe</h1>
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
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;