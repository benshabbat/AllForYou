import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipe, rateRecipe, commentOnRecipe } from '../services/api';
import RecipeHeader from '../components/RecipeHeader';
import IngredientsList from '../components/IngredientsList';
import Instructions from '../components/Instructions';
import AllergenInfo from '../components/AllergenInfo';
import Substitutions from '../components/Substitutions';
import CommentSection from '../components/CommentSection';

function Recipe() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await getRecipe(id);
      setRecipe(response.data);
    } catch (err) {
      setError('אירעה שגיאה בטעינת המתכון. אנא נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (score) => {
    try {
      const response = await rateRecipe(id, score);
      setRecipe(prev => ({ ...prev, averageRating: response.data.averageRating }));
    } catch (error) {
      console.error('Error rating recipe:', error);
      // כאן אפשר להוסיף הודעת שגיאה למשתמש
    }
  };

  const handleAddComment = async (text) => {
    try {
      const response = await commentOnRecipe(id, text);
      setRecipe(prev => ({ ...prev, comments: response.data }));
    } catch (error) {
      console.error('Error adding comment:', error);
      // כאן אפשר להוסיף הודעת שגיאה למשתמש
    }
  };

  if (loading) return <div className="loading">טוען מתכון...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!recipe) return <div className="not-found">מתכון לא נמצא.</div>;

  return (
    <div className="recipe-page">
      <RecipeHeader 
        name={recipe.name} 
        averageRating={recipe.averageRating} 
        onRate={handleRate} 
      />
      <IngredientsList ingredients={recipe.ingredients} />
      <Instructions instructions={recipe.instructions} />
      <AllergenInfo allergens={recipe.allergens} />
      <Substitutions substitutions={recipe.substitutions} />
      <CommentSection comments={recipe.comments} onAddComment={handleAddComment} />
    </div>
  );
}

export default Recipe;