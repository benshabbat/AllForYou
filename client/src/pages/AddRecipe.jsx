import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAddRecipe } from "../hooks/useAddRecipe";
import { useAllergens } from "../hooks/useAllergens";
import FormField from "../components/FormField";
import AllergenSelection from "../components/AllergenSelection";
import styles from "./AddRecipe.module.css";

const recipeSchema = yup.object().shape({
  name: yup.string().required("שם המתכון הוא שדה חובה"),
  description: yup.string().required("תיאור קצר הוא שדה חובה"),
  ingredients: yup.string().required("רשימת המרכיבים היא שדה חובה"),
  instructions: yup.string().required("הוראות ההכנה הן שדה חובה"),
  preparationTime: yup.number().positive().integer().required("זמן הכנה הוא שדה חובה"),
  cookingTime: yup.number().positive().integer().required("זמן בישול הוא שדה חובה"),
  servings: yup.number().positive().integer().required("מספר מנות הוא שדה חובה"),
  difficulty: yup.string().oneOf(["Easy", "Medium", "Hard"]).required("רמת קושי היא שדה חובה"),
  category: yup.string().oneOf(["Appetizer", "Main Course", "Dessert", "Beverage", "Snack"]).required("קטגוריה היא שדה חובה"),
  allergens: yup.array().of(yup.string()),
  image: yup.string().url("נא להזין כתובת URL תקינה לתמונה"),
});

const AddRecipe = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(recipeSchema),
    defaultValues: {
      name: "",
      description: "",
      ingredients: "",
      instructions: "",
      preparationTime: "",
      cookingTime: "",
      servings: "",
      difficulty: "",
      category: "",
      allergens: [],
      image: "",
    },
  });

  const addRecipeMutation = useAddRecipe();
  const { allergens, isLoading: allergensLoading } = useAllergens();

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        ingredients: data.ingredients.split("\n").map(item => item.trim()).filter(Boolean),
        instructions: data.instructions.trim(),
        preparationTime: Number(data.preparationTime),
        cookingTime: Number(data.cookingTime),
        servings: Number(data.servings),
      };
      console.log("Sending data:", formattedData);
      await addRecipeMutation.mutateAsync(formattedData);
      console.log("מתכון נוסף בהצלחה");
    } catch (error) {
      console.error("שגיאה בהוספת המתכון:", error.response?.data || error);
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
        <FormField
          name="ingredients"
          control={control}
          label="מרכיבים (כל מרכיב בשורה חדשה)"
          error={errors.ingredients}
          as="textarea"
        />
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
        <FormField
          name="difficulty"
          control={control}
          label="רמת קושי"
          error={errors.difficulty}
          as="select"
          options={[
            { value: "Easy", label: "קל" },
            { value: "Medium", label: "בינוני" },
            { value: "Hard", label: "מאתגר" },
          ]}
        />
        <FormField
          name="category"
          control={control}
          label="קטגוריה"
          error={errors.category}
          as="select"
          options={[
            { value: "Appetizer", label: "מנה ראשונה" },
            { value: "Main Course", label: "מנה עיקרית" },
            { value: "Dessert", label: "קינוח" },
            { value: "Beverage", label: "משקה" },
            { value: "Snack", label: "חטיף" },
          ]}
        />
        <AllergenSelection
          name="allergens"
          control={control}
          label="אלרגנים"
          error={errors.allergens}
          allergens={allergens || []}
        />
        <FormField
          name="image"
          control={control}
          label="קישור לתמונה"
          error={errors.image}
          placeholder="https://example.com/image.jpg"
        />
        <button type="submit" className={styles.submitButton} disabled={addRecipeMutation.isLoading}>
          {addRecipeMutation.isLoading ? "מוסיף מתכון..." : "הוסף מתכון"}
        </button>
      </form>
    </div>
  );
};

export default React.memo(AddRecipe);