import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipe, deleteRecipe } from '../services/api';

function Recipe() {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams(); // קבלת מזהה המתכון מה-URL
  const navigate = useNavigate();

  // טעינת המתכון בעת טעינת הדף
  useEffect(() => {
    getRecipe(id).then(res => setRecipe(res.data));
  }, [id]);

  // טיפול במחיקת מתכון
  const handleDelete = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מתכון זה?')) {
      deleteRecipe(id).then(() => {
        navigate('/'); // ניווט לדף הבית לאחר מחיקה
      });
    }
  };

  if (!recipe) return <div>טוען...</div>;

  return (
    <div className="recipe-page">
      <h2>{recipe.name}</h2>
      
      <h3>מצרכים:</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h3>הוראות הכנה:</h3>
      <p>{recipe.instructions}</p>

      <h3>אלרגנים:</h3>
      <p>{recipe.allergens.join(', ')}</p>

      <h3>תחליפים:</h3>
      <ul>
        {recipe.substitutions.map((sub, index) => (
          <li key={index}>
            {sub.ingredient}: {sub.alternatives.join(', ')}
          </li>
        ))}
      </ul>

      <div className="recipe-actions">
        <Link to={`/edit-recipe/${id}`}>ערוך מתכון</Link>
        <button onClick={handleDelete}>מחק מתכון</button>
      </div>
    </div>
  );
}

export default Recipe;