import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipe, updateRecipe } from '../services/api';

function EditRecipe() {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getRecipe(id).then(res => setRecipe(res.data));
  }, [id]);

  const handleChange = (e, index, field, subField) => {
    // דומה ל-AddRecipe
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateRecipe(id, recipe).then(() => {
      navigate(`/recipe/${id}`);
    });
  };

  if (!recipe) return <div>טוען...</div>;

  return (
    <form onSubmit={handleSubmit} className="edit-recipe-form">
      {/* שדות טופס דומים ל-AddRecipe */}
      <button type="submit">עדכן מתכון</button>
    </form>
  );
}

export default EditRecipe;