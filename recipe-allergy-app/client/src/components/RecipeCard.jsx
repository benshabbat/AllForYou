import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} />
      <h3>{recipe.title}</h3>
      <p>Allergens: {recipe.allergens.join(', ')}</p>
      <Link to={`/recipe/${recipe._id}`}>View Details</Link>
    </div>
  );
};

export default RecipeCard;