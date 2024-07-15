import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../store/slices/recipeSlice";
import { fetchAllergens } from "../services/allergenService"; // וודא שזה הנתיב הנכון
import { toast } from "react-toastify";
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

const useAddRecipeMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation(addRecipe, {
    onSuccess: () => {
      queryClient.invalidateQueries("recipes");
      toast.success("המתכון נוסף בהצלחה");
      navigate("/my-recipes");
    },
    onError: (error) => {
      toast.error(`שגיאה בהוספת המתכון: ${error.message}`);
    },
  });
};

const AddRecipe = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(recipeSchema),
    defaultValues: {
      allergens: [],
    },
  });

  const mutation = useAddRecipeMutation();
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
        <AllergensField
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
        <SubmitButton isLoading={mutation.isLoading} />
      </form>
    </div>
  );
};

const FormField = ({ name, control, label, error, as = "input", options = [], ...rest }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <div className={styles.formGroup}>
        <label htmlFor={name}>{label}</label>
        {as === "textarea" ? (
          <textarea {...field} id={name} {...rest} />
        ) : as === "select" ? (
          <select {...field} id={name} {...rest}>
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : (
          <input {...field} id={name} {...rest} />
        )}
        {error && <span className={styles.error}>{error.message}</span>}
      </div>
    )}
  />
);

const AllergensField = ({ name, control, label, error, allergens }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <div className={styles.formGroup}>
        <label>{label}</label>
        <div className={styles.checkboxGroup}>
          {allergens.map((allergen) => (
            <label key={allergen._id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={allergen._id}
                checked={field.value.includes(allergen._id)}
                onChange={(e) => {
                  const updatedAllergens = e.target.checked
                    ? [...field.value, allergen._id]
                    : field.value.filter((id) => id !== allergen._id);
                  field.onChange(updatedAllergens);
                }}
              />
              {allergen.name}
            </label>
          ))}
        </div>
        {error && <span className={styles.error}>{error.message}</span>}
      </div>
    )}
  />
);

const SubmitButton = ({ isLoading }) => (
  <button
    type="submit"
    className={styles.submitButton}
    disabled={isLoading}
  >
    {isLoading ? "מוסיף מתכון..." : "הוסף מתכון"}
  </button>
);

export default React.memo(AddRecipe);