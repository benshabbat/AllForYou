import React, { useState, useEffect } from 'react';

function RecipeList({ filter }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // כאן נוסיף בקשת API לקבלת מתכונים מהשרת
    // לעת עתה, נשתמש בנתונים לדוגמה
    setRecipes([
      { id: 1, name: 'פסטה ללא גלוטן', ingredients: ['פסטה ללא גלוטן', 'רוטב עגבניות', 'ירקות'] },
      { id: 2, name: 'עוגת שוקולד ללא ביצים', ingredients: ['קמח', 'קקאו', 'חלב סויה'] },
    ]);
  }, [filter]);

  return (
    <div>
      <h2>רשימת מתכונים</h2>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <h3>{recipe.name}</h3>
            <p>מרכיבים: {recipe.ingredients.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeList;