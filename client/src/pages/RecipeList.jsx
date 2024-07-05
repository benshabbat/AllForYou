import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import RecipeFilter from '../components/RecipeFilter';

// RecipeList component - עמוד רשימת המתכונים
function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    // כאן נוסיף קריאה לשרת לקבלת רשימת המתכונים
    // לדוגמה:
    // fetchRecipes().then(data => {
    //   setRecipes(data);
    //   setFilteredRecipes(data);
    // });
  }, []);

  const handleFilter = (allergens) => {
    const filtered = recipes.filter(recipe => 
      !recipe.allergens.some(allergen => allergens.includes(allergen))
    );
    setFilteredRecipes(filtered);
  };

  return (
    <div className="recipe-list">
      <h2>רשימת מתכונים</h2>
      <RecipeFilter onFilter={handleFilter} />
      <div className="recipes-grid">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default RecipeList;