import React, { useState, useEffect } from 'react';
import { getRecipes } from '../services/api';
import SearchBar from '../components/SearchBar';
import AllergenFilter from '../components/AllergenFilter';
import RecipeList from '../components/RecipeList';
import Pagination from '../components/Pagination';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allergenFilter, setAllergenFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 10;

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await getRecipes();
      setRecipes(response.data);
      setLoading(false);
    } catch (err) {
      setError('אירעה שגיאה בטעינת המתכונים. אנא נסה שוב מאוחר יותר.');
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (allergenFilter.length === 0 || 
     !recipe.allergens.some(allergen => allergenFilter.includes(allergen)))
  );

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const allAllergens = [...new Set(recipes.flatMap(recipe => recipe.allergens))];

  const handleAllergenChange = (allergen) => {
    setAllergenFilter(prev =>
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
    setCurrentPage(1);
  };

  if (loading) return <div>טוען מתכונים...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home-page">
      <h2>מתכונים ידידותיים לאלרגיות</h2>
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <AllergenFilter 
        allergens={allAllergens} 
        allergenFilter={allergenFilter} 
        handleAllergenChange={handleAllergenChange} 
      />

      <RecipeList recipes={currentRecipes} />

      <Pagination 
        recipesPerPage={recipesPerPage}
        totalRecipes={filteredRecipes.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}

export default Home;