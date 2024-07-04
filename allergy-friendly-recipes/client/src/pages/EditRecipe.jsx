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
    const { name, value } = e.target;
    if (field === "ingredients" || field === "allergens") {
      const newArray = [...recipe[field]];
      newArray[index] = value;
      setRecipe({ ...recipe, [field]: newArray });
    } else if (field === "substitutions") {
      const newSubs = [...recipe.substitutions];
      newSubs[index][subField] = value;
      setRecipe({ ...recipe, substitutions: newSubs });
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
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