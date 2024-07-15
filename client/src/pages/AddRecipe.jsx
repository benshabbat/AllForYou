import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "react-query";
import { fetchAllergens } from "../services/allergenService";
import FormField from "../components/FormField";
import AllergenSelection from "../components/AllergenSelection";
import { useAddRecipe } from "../hooks/useAddRecipe";
import styles from "./AddRecipe.module.css";

const recipeSchema = yup.object().shape({
  name: yup.string().required("שם המתכון הוא שדה חובה"),
  description: yup.string().required("תיאור קצר הוא שדה חובה"),
  ingredients: yup.string().required("רשימת המרכיבים היא שדה חובה"),
  instructions: yup.string().required("הוראות ההכנה הן שדה חובה"),
  prepTime: yup.number().positive().integer().required("זמן הכנה הוא שדה חובה"),
  cookTime: yup.number().positive().integer().required("זמן בישול הוא שדה חובה"),
  servings: yup.number().positive().integer().required("מספר מנות הוא שדה חובה"),
  difficulty: yup.string().oneOf(["easy", "medium", "hard"]).required("רמת קושי היא שדה חובה"),
  allergens: yup.array().of(yup.string()),
  alternatives: yup.string(),
});

const AddRecipe = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(recipeSchema),
    defaultValues: {
      allergens: [],
    },
  });

  const mutation = useAddRecipe();
  const { data: allergens, isLoading: allergensLoading, error: allergensError } = useQuery("allergens", fetchAllergens);

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      ingredients: data.ingredients.split("\n"),
    };
    mutation.mutate(formattedData);
  };

  if (allergensLoading) return <div>טוען אלרגנים...</div>;
  if (allergensError) return <div>שגיאה בטעינת אלרגנים: {allergensError.message}</div>;

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
            name="prepTime"
            control={control}
            label="זמן הכנה (דקות)"
            error={errors.prepTime}
            type="number"
          />
          <FormField
            name="cookTime"
            control={control}
            label="זמן בישול (דקות)"
            error={errors.cookTime}
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
            { value: "easy", label: "קל" },
            { value: "medium", label: "בינוני" },
            { value: "hard", label: "קשה" },
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
          name="alternatives"
          control={control}
          label="חלופות"
          error={errors.alternatives}
          as="textarea"
        />
        <button type="submit" className={styles.submitButton} disabled={mutation.isLoading}>
          {mutation.isLoading ? "מוסיף מתכון..." : "הוסף מתכון"}
        </button>
      </form>
    </div>
  );
};

export default React.memo(AddRecipe);