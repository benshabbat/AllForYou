
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAddRecipe } from "../hooks/useRecipe";
import { useAllergens } from "../hooks/useAllergens";
import FormField from "../components/FormField";
import AllergenSelection from "../components/AllergenSelection";
import ImageUpload from "../components/ImageUpload";
import { CATEGORIES, DIFFICULTY_LEVELS } from "../constants";
import styles from "./AddRecipe.module.css";

const recipeSchema = yup.object().shape({
  name: yup.string().required("שם המתכון הוא שדה חובה").max(100, "שם המתכון ארוך מדי"),
  description: yup.string().required("תיאור קצר הוא שדה חובה").max(500, "התיאור ארוך מדי"),
  ingredients: yup.array().of(yup.string()).min(1, "יש להזין לפחות מרכיב אחד"),
  instructions: yup.string().required("הוראות ההכנה הן שדה חובה"),
  preparationTime: yup.number().positive().integer().required("זמן הכנה הוא שדה חובה"),
  cookingTime: yup.number().positive().integer().required("זמן בישול הוא שדה חובה"),
  servings: yup.number().positive().integer().required("מספר מנות הוא שדה חובה"),
  difficulty: yup.string().oneOf(DIFFICULTY_LEVELS).required("רמת קושי היא שדה חובה"),
  category: yup.string().oneOf(CATEGORIES).required("קטגוריה היא שדה חובה"),
  allergens: yup.array().of(yup.string()),
  image: yup.mixed().test("fileSize", "הקובץ גדול מדי (מקסימום 5MB)", (value) => {
    if (!value) return true; // Allow empty
    return value.size <= 5000000; // 5MB
  }),
});

const AddRecipe = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(recipeSchema),
    defaultValues: {
      name: "",
      description: "",
      ingredients: [""],
      instructions: "",
      preparationTime: "",
      cookingTime: "",
      servings: "",
      difficulty: "",
      category: "",
      allergens: [],
      image: null,
    },
  });

  const addRecipeMutation = useAddRecipe();
  const { allergens, isLoading: allergensLoading } = useAllergens();

  const ingredients = watch("ingredients");

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'ingredients') {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key === 'image' && data[key]) {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      await addRecipeMutation.mutateAsync(formData);
      navigate('/my-recipes');
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  const handleAddIngredient = () => {
    setValue("ingredients", [...ingredients, ""]);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setValue("ingredients", newIngredients);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", e.target.files);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (allergensLoading) return <div>טוען אלרגנים...</div>;

  return (
    <div className={styles.addRecipeContainer}>
      <h2 className={styles.title}>הוספת מתכון חדש</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormField
          name="name"
          control={control}
          label="שם המתכון"
          error={errors.name}
        />
        <FormField
          name="description"
          control={control}
          label="תיאור קצר"
          error={errors.description}
          as="textarea"
        />
        <div className={styles.ingredientsSection}>
          <label>מרכיבים:</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className={styles.ingredientRow}>
              <Controller
                name={`ingredients.${index}`}
                control={control}
                render={({ field }) => (
                  <input {...field} placeholder={`מרכיב ${index + 1}`} />
                )}
              />
              <button type="button" onClick={() => handleRemoveIngredient(index)} className={styles.removeIngredient}>
                הסר
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddIngredient} className={styles.addIngredient}>
            הוסף מרכיב
          </button>
          {errors.ingredients && <span className={styles.error}>{errors.ingredients.message}</span>}
        </div>
        <FormField
          name="instructions"
          control={control}
          label="הוראות הכנה"
          error={errors.instructions}
          as="textarea"
        />
        <div className={styles.formRow}>
          <FormField
            name="preparationTime"
            control={control}
            label="זמן הכנה (דקות)"
            error={errors.preparationTime}
            type="number"
          />
          <FormField
            name="cookingTime"
            control={control}
            label="זמן בישול (דקות)"
            error={errors.cookingTime}
            type="number"
          />
          <FormField
            name="servings"
            control={control}
            label="מספר מנות"
            error={errors.servings}
            type="number"
          />
        </div>
        <div className={styles.formRow}>
          <FormField
            name="difficulty"
            control={control}
            label="רמת קושי"
            error={errors.difficulty}
            as="select"
            options={DIFFICULTY_LEVELS.map(level => ({ value: level, label: level }))}
          />
          <FormField
            name="category"
            control={control}
            label="קטגוריה"
            error={errors.category}
            as="select"
            options={CATEGORIES.map(category => ({ value: category, label: category }))}
          />
        </div>
        <AllergenSelection
          name="allergens"
          control={control}
          label="אלרגנים"
          error={errors.allergens}
          allergens={allergens || []}
        />
        <ImageUpload
          onChange={handleImageChange}
          preview={imagePreview}
          error={errors.image}
        />
        <button type="submit" className={styles.submitButton} disabled={addRecipeMutation.isLoading}>
          {addRecipeMutation.isLoading ? "מוסיף מתכון..." : "הוסף מתכון"}
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;