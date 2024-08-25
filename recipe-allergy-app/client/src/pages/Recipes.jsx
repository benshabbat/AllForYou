import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import ErrorMessage from '../components/ErrorMessage';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching recipes');
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1>Recipes</h1>
      {userInfo && (
        <Link to="/add-recipe">Add New Recipe</Link>
      )}
      <div className="recipe-list">
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Recipes;