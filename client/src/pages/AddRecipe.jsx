import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../store/slices/recipeSlice";
import styles from "./AddRecipe.module.css";

function AddRecipe() {
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: "",
    instructions: "",
    category: "",
    allergens: [],
    prepTime: "",
    cookTime: "",
    servings: "",
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.recipes);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]:
        name === "allergens"
          ? value.split(",").map((item) => item.trim())
          : value,
    }));
    // ניקוי שגיאות בעת הקלדה
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!recipe.name.trim()) newErrors.name = "שם המתכון הוא שדה חובה";
    if (!recipe.ingredients.trim())
      newErrors.ingredients = "יש להזין לפחות מרכיב אחד";
    if (!recipe.instructions.trim())
      newErrors.instructions = "יש להזין הוראות הכנה";
    if (!recipe.category) newErrors.category = "יש לבחור קטגוריה";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const result = await dispatch(addRecipe(recipe)).unwrap();
        navigate(`/recipe/${result._id}`);
      } catch (err) {
        setErrors({ submit: err.message || "אירעה שגיאה בהוספת המתכון" });
      }
    }
  };

  return (
    <div className={styles.addRecipeContainer}>
      <h2 className={styles.title}>הוספת מתכון חדש</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* שם המתכון */}
        <div className={styles.formGroup}>
          <label htmlFor="name">שם המתכון</label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* תיאור המתכון */}
        <div className={styles.formGroup}>
          <label htmlFor="description">תיאור קצר</label>
          <textarea
            id="description"
            name="description"
            value={recipe.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* רכיבים */}
        <div className={styles.formGroup}>
          <label htmlFor="ingredients">רכיבים (כל רכיב בשורה חדשה)</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={recipe.ingredients}
            onChange={handleChange}
            required
          />
        </div>

        {/* הוראות הכנה */}
        <div className={styles.formGroup}>
          <label htmlFor="instructions">הוראות הכנה</label>
          <textarea
            id="instructions"
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
            required
          />
        </div>

        {/* קטגוריה */}
        <div className={styles.formGroup}>
          <label htmlFor="category">קטגוריה</label>
          <select
            id="category"
            name="category"
            value={recipe.category}
            onChange={handleChange}
            required
          >
            <option value="">בחר קטגוריה</option>
            <option value="עיקריות">עיקריות</option>
            <option value="קינוחים">קינוחים</option>
            <option value="סלטים">סלטים</option>
            <option value="מרקים">מרקים</option>
          </select>
        </div>

        {/* אלרגנים */}
        <div className={styles.formGroup}>
          <label htmlFor="allergens">אלרגנים (מופרדים בפסיקים)</label>
          <input
            type="text"
            id="allergens"
            name="allergens"
            value={recipe.allergens.join(", ")}
            onChange={handleChange}
          />
        </div>

        {/* זמן הכנה */}
        <div className={styles.formGroup}>
          <label htmlFor="prepTime">זמן הכנה (בדקות)</label>
          <input
            type="number"
            id="prepTime"
            name="prepTime"
            value={recipe.prepTime}
            onChange={handleChange}
          />
        </div>

        {/* זמן בישול */}
        <div className={styles.formGroup}>
          <label htmlFor="cookTime">זמן בישול (בדקות)</label>
          <input
            type="number"
            id="cookTime"
            name="cookTime"
            value={recipe.cookTime}
            onChange={handleChange}
          />
        </div>

        {/* מספר מנות */}
        <div className={styles.formGroup}>
          <label htmlFor="servings">מספר מנות</label>
          <input
            type="number"
            id="servings"
            name="servings"
            value={recipe.servings}
            onChange={handleChange}
          />
        </div>

        {/* הצגת שגיאות */}
        {errors.submit && <p className={styles.error}>{errors.submit}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "מוסיף מתכון..." : "הוסף מתכון"}
        </button>
      </form>
    </div>
  );
}

export default AddRecipe;
