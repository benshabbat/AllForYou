import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addRecipe } from '../services/api';

function AddRecipe() {
  // מצב התחלתי של המתכון
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: [''],
    instructions: '',
    allergens: [''],
    substitutions: [{ ingredient: '', alternatives: [''] }]
  });

  const navigate = useNavigate();

  // טיפול בשינויים בשדות הטופס
  const handleChange = (e, index, field, subField) => {
    const { name, value } = e.target;
    if (field === 'ingredients' || field === 'allergens') {
      // עדכון מערכים פשוטים
      const newArray = [...recipe[field]];
      newArray[index] = value;
      setRecipe({ ...recipe, [field]: newArray });
    } else if (field === 'substitutions') {
      // עדכון מערך של אובייקטים
      const newSubs = [...recipe.substitutions];
      newSubs[index][subField] = value;
      setRecipe({ ...recipe, substitutions: newSubs });
    } else {
      // עדכון שדות רגילים
      setRecipe({ ...recipe, [name]: value });
    }
  };

  // הוספת שדה חדש (מצרך, אלרגן או תחליף)
  const addField = (field) => {
    if (field === 'substitutions') {
      setRecipe({
        ...recipe,
        substitutions: [...recipe.substitutions, { ingredient: '', alternatives: [''] }]
      });
    } else {
      setRecipe({ ...recipe, [field]: [...recipe[field], ''] });
    }
  };

  // שליחת הטופס
  const handleSubmit = (e) => {
    e.preventDefault();
    addRecipe(recipe).then(() => {
      navigate('/'); // ניווט לדף הבית לאחר הוספת המתכון
    });
  };

  return (
    <form onSubmit={handleSubmit} className="add-recipe-form">
      {/* שדות הטופס */}
      <input
        type="text"
        name="name"
        value={recipe.name}
        onChange={handleChange}
        placeholder="שם המתכון"
        required
      />
      
      <h3>מצרכים:</h3>
      {recipe.ingredients.map((ing, index) => (
        <input
          key={index}
          type="text"
          value={ing}
          onChange={(e) => handleChange(e, index, 'ingredients')}
          placeholder="מצרך"
        />
      ))}
      <button type="button" onClick={() => addField('ingredients')}>הוסף מצרך</button>

      {/* שדות נוספים: הוראות, אלרגנים, תחליפים */}
      {/* ... */}

      <button type="submit">הוסף מתכון</button>
    </form>
  );
}

export default AddRecipe;