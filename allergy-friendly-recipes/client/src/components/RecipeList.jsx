import React, { useState, useEffect } from 'react';
import { fetchRecipes, updateRecipe, deleteRecipe } from '../api';

function RecipeList({ filter }) {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadRecipes();
  }, [filter]);

  async function loadRecipes() {
    try {
      const data = await fetchRecipes(filter);
      setRecipes(data);
    } catch (err) {
      setError('Failed to load recipes');
    }
  }

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id, updatedRecipe) => {
    try {
      await updateRecipe(id, updatedRecipe);
      setEditingId(null);
      loadRecipes();
    } catch (err) {
      setError('Failed to update recipe');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe(id);
        loadRecipes();
      } catch (err) {
        setError('Failed to delete recipe');
      }
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="recipe-list">
      {recipes.map(recipe => (
        <div key={recipe._id} className="recipe-card">
          {editingId === recipe._id ? (
            <EditRecipeForm
              recipe={recipe}
              onSave={(updatedRecipe) => handleSave(recipe._id, updatedRecipe)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <h3>{recipe.name}</h3>
              <p>מרכיבים: {recipe.ingredients.join(', ')}</p>
              {recipe.allergens && <p>אלרגנים: {recipe.allergens.join(', ')}</p>}
              <button onClick={() => handleEdit(recipe._id)}>ערוך</button>
              <button onClick={() => handleDelete(recipe._id)}>מחק</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function EditRecipeForm({ recipe, onSave, onCancel }) {
  const [name, setName] = useState(recipe.name);
  const [ingredients, setIngredients] = useState(recipe.ingredients.join(', '));
  const [allergens, setAllergens] = useState(recipe.allergens ? recipe.allergens.join(', ') : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...recipe,
      name,
      ingredients: ingredients.split(',').map(i => i.trim()),
      allergens: allergens.split(',').map(a => a.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="שם המתכון"
        required
      />
      <textarea
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="מרכיבים (מופרדים בפסיקים)"
        required
      />
      <input
        type="text"
        value={allergens}
        onChange={(e) => setAllergens(e.target.value)}
        placeholder="אלרגנים (מופרדים בפסיקים)"
      />
      <button type="submit">שמור</button>
      <button type="button" onClick={onCancel}>בטל</button>
    </form>
  );
}

export default RecipeList;