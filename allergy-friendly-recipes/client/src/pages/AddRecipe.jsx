import React, { useState } from "react";
import { addRecipe } from "../services/api";

function AddRecipe() {
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [""],
    instructions: "",
    allergens: [""],
    substitutions: [{ ingredient: "", alternatives: [""] }],
  });

  const handleChange = (e, index, field, subField) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => {
      if (field === "ingredients" || field === "allergens") {
        const newArray = [...prevRecipe[field]];
        newArray[index] = value;
        return { ...prevRecipe, [field]: newArray };
      } else if (field === "substitutions") {
        const newSubs = [...prevRecipe.substitutions];
        newSubs[index][subField] = value;
        return { ...prevRecipe, substitutions: newSubs };
      } else {
        return { ...prevRecipe, [name]: value };
      }
    });
  };

  const addField = (field) => {
    setRecipe((prevRecipe) => {
      if (field === "substitutions") {
        return {
          ...prevRecipe,
          substitutions: [
            ...prevRecipe.substitutions,
            { ingredient: "", alternatives: [""] },
          ],
        };
      } else {
        return { ...prevRecipe, [field]: [...prevRecipe[field], ""] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRecipe(recipe);
      // ניתן להוסיף כאן לוגיקה נוספת לאחר הוספת המתכון בהצלחה
    } catch (error) {
      console.error("שגיאה בהוספת המתכון:", error);
      // ניתן להוסיף כאן טיפול בשגיאה
    }
  };

  const renderInputField = (value, onChange, placeholder) => (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );

  return (
    <form onSubmit={handleSubmit} className="add-recipe-form">
      {renderInputField(recipe.name, handleChange, "שם המתכון")}

      <h3>מצרכים:</h3>
      {recipe.ingredients.map((ing, index) => (
        <div key={`ingredient-${index}`}>
          {renderInputField(ing, (e) => handleChange(e, index, "ingredients"), "מצרך")}
        </div>
      ))}
      <button type="button" onClick={() => addField("ingredients")}>
        הוסף מצרך
      </button>

      <textarea
        name="instructions"
        value={recipe.instructions}
        onChange={handleChange}
        placeholder="הוראות הכנה"
        required
      />

      <h3>אלרגנים:</h3>
      {recipe.allergens.map((allergen, index) => (
        <div key={`allergen-${index}`}>
          {renderInputField(allergen, (e) => handleChange(e, index, "allergens"), "אלרגן")}
        </div>
      ))}
      <button type="button" onClick={() => addField("allergens")}>
        הוסף אלרגן
      </button>

      <h3>תחליפים:</h3>
      {recipe.substitutions.map((sub, index) => (
        <div key={`substitution-${index}`}>
          {renderInputField(
            sub.ingredient,
            (e) => handleChange(e, index, "substitutions", "ingredient"),
            "מצרך לתחליף"
          )}
          {renderInputField(
            sub.alternatives.join(", "),
            (e) => handleChange(e, index, "substitutions", "alternatives"),
            "תחליפים (מופרדים בפסיקים)"
          )}
        </div>
      ))}
      <button type="button" onClick={() => addField("substitutions")}>
        הוסף תחליף
      </button>

      <button type="submit">הוסף מתכון</button>
    </form>
  );
}

export default AddRecipe;