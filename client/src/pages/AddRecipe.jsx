import React,{useCallback} from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../store/slices/recipeSlice";
import { toast } from "react-toastify";
import styles from "./AddRecipe.module.css";

const schema = yup.object().shape({
  name: yup.string().required("שם המתכון הוא שדה חובה"),
  description: yup.string().required("תיאור קצר הוא שדה חובה"),
  ingredients: yup.string().required("רשימת המרכיבים היא שדה חובה"),
  instructions: yup.string().required("הוראות ההכנה הן שדה חובה"),
  prepTime: yup.number().positive().integer().required("זמן הכנה הוא שדה חובה"),
  cookTime: yup
    .number()
    .positive()
    .integer()
    .required("זמן בישול הוא שדה חובה"),
  servings: yup
    .number()
    .positive()
    .integer()
    .required("מספר מנות הוא שדה חובה"),
  difficulty: yup
    .string()
    .oneOf(["easy", "medium", "hard"])
    .required("רמת קושי היא שדה חובה"),
  allergens: yup.string(),
  alternatives: yup.string(),
});

function AddRecipe() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation(addRecipe, {
    onSuccess: () => {
      queryClient.invalidateQueries("recipes");
      toast.success("המתכון נוסף בהצלחה");
      navigate("/my-recipes");
    },
    onError: (error) => {
      toast.error(`שגיאה בהוספת המתכון: ${error.message}`);
    },
  });

  const onSubmit = useCallback((data) => {
    const formattedData = {
      ...data,
      ingredients: data.ingredients.split("\n"),
      allergens: data.allergens
        ? data.allergens.split(",").map((item) => item.trim())
        : [],
    };
    mutation.mutate(formattedData);
  }, [mutation]);


  return (
    <div className={styles.addRecipeContainer}>
      <h2 className={styles.title}>הוספת מתכון חדש</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className={styles.formGroup}>
              <label htmlFor="name">שם המתכון</label>
              <input {...field} id="name" type="text" />
              {errors.name && (
                <span className={styles.error}>{errors.name.message}</span>
              )}
            </div>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className={styles.formGroup}>
              <label htmlFor="description">תיאור קצר</label>
              <textarea {...field} id="description" />
              {errors.description && (
                <span className={styles.error}>
                  {errors.description.message}
                </span>
              )}
            </div>
          )}
        />

        <Controller
          name="ingredients"
          control={control}
          render={({ field }) => (
            <div className={styles.formGroup}>
              <label htmlFor="ingredients">מרכיבים (כל מרכיב בשורה חדשה)</label>
              <textarea {...field} id="ingredients" />
              {errors.ingredients && (
                <span className={styles.error}>
                  {errors.ingredients.message}
                </span>
              )}
            </div>
          )}
        />

        <Controller
          name="instructions"
          control={control}
          render={({ field }) => (
            <div className={styles.formGroup}>
              <label htmlFor="instructions">הוראות הכנה</label>
              <textarea {...field} id="instructions" />
              {errors.instructions && (
                <span className={styles.error}>
                  {errors.instructions.message}
                </span>
              )}
            </div>
          )}
        />

        <div className={styles.formRow}>
          <Controller
            name="prepTime"
            control={control}
            render={({ field }) => (
              <div className={styles.formGroup}>
                <label htmlFor="prepTime">זמן הכנה (דקות)</label>
                <input {...field} id="prepTime" type="number" />
                {errors.prepTime && (
                  <span className={styles.error}>
                    {errors.prepTime.message}
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            name="cookTime"
            control={control}
            render={({ field }) => (
              <div className={styles.formGroup}>
                <label htmlFor="cookTime">זמן בישול (דקות)</label>
                <input {...field} id="cookTime" type="number" />
                {errors.cookTime && (
                  <span className={styles.error}>
                    {errors.cookTime.message}
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            name="servings"
            control={control}
            render={({ field }) => (
              <div className={styles.formGroup}>
                <label htmlFor="servings">מספר מנות</label>
                <input {...field} id="servings" type="number" />
                {errors.servings && (
                  <span className={styles.error}>
                    {errors.servings.message}
                  </span>
                )}
              </div>
            )}
          />
        </div>

        <Controller
          name="difficulty"
          control={control}
          render={({ field }) => (
            <div className={styles.formGroup}>
              <label htmlFor="difficulty">רמת קושי</label>
              <select {...field} id="difficulty">
                <option value="easy">קל</option>
                <option value="medium">בינוני</option>
                <option value="hard">קשה</option>
              </select>
              {errors.difficulty && (
                <span className={styles.error}>
                  {errors.difficulty.message}
                </span>
              )}
            </div>
          )}
        />

        <Controller
          name="allergens"
          control={control}
          render={({ field }) => (
            <div className={styles.formGroup}>
              <label htmlFor="allergens">אלרגנים (מופרדים בפסיקים)</label>
              <input {...field} id="allergens" type="text" />
              {errors.allergens && (
                <span className={styles.error}>{errors.allergens.message}</span>
              )}
            </div>
          )}
        />

        <Controller
          name="alternatives"
          control={control}
          render={({ field }) => (
            <div className={styles.formGroup}>
              <label htmlFor="alternatives">חלופות</label>
              <textarea {...field} id="alternatives" />
              {errors.alternatives && (
                <span className={styles.error}>
                  {errors.alternatives.message}
                </span>
              )}
            </div>
          )}
        />

        <button
          type="submit"
          className={styles.submitButton}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "מוסיף מתכון..." : "הוסף מתכון"}
        </button>
      </form>
    </div>
  );
}

export default React.memo(AddRecipe);
