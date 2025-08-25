import { useState, useCallback, useRef, memo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useMutation } from 'react-query';
import { apiUtils } from '../../utils/apiUtils';
import FormField from "../../components/common/formField/FormField";
import ImageUpload from "../../components/imageUpload/ImageUpload";
import { CATEGORIES, DIFFICULTY_LEVELS } from "../../constants";
import {useToast} from '../../components/common/toast/Toast';
import styles from "./AddRecipe.module.css";


// הגדרת ערכי ברירת מחדל מחוץ לקומפוננטה
const defaultValues = {
  name: "",
  description: "",
  ingredients: [],
  instructions: "",
  preparationTime: "",
  cookingTime: "",
  servings: "",
  difficulty: "",
  category: "",
  allergens: [],
  image: null,
};

// סכמת ולידציה
const recipeSchema = yup.object().shape({
  name: yup.string().required("שם המתכון הוא שדה חובה").max(100, "שם המתכון ארוך מדי"),
  description: yup.string().required("תיאור קצר הוא שדה חובה").max(500, "התיאור ארוך מדי"),
  ingredients: yup.array().of(yup.string().trim().min(1, "מרכיב לא יכול להיות ריק")).min(1, "יש להזין לפחות מרכיב אחד"),
  instructions: yup.string().required("הוראות ההכנה הן שדה חובה"),
  preparationTime: yup.number().typeError("יש להזין מספר").positive().integer().required("זמן הכנה הוא שדה חובה"),
  cookingTime: yup.number().typeError("יש להזין מספר").positive().integer().required("זמן בישול הוא שדה חובה"),
  servings: yup.number().typeError("יש להזין מספר").positive().integer().required("מספר מנות הוא שדה חובה"),
  difficulty: yup.string().oneOf(DIFFICULTY_LEVELS).required("רמת קושי היא שדה חובה"),
  category: yup.string().oneOf(CATEGORIES).required("קטגוריה היא שדה חובה"),
  allergens: yup.array().of(yup.string()),
  image: yup.mixed().nullable(),
});

const AddRecipe = () => {


  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const { addToast } = useToast();
  const nameInputRef = useRef(null);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(recipeSchema),
    defaultValues,
  });

  // פוקוס אוטומטי לשם המתכון בטעינה
  React.useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const addRecipeMutation = useMutation(apiUtils?.createRecipe, {
    onSuccess: () => {
      addToast('המתכון נוסף בהצלחה', 'success');
      navigate("/my-recipes");
    },
    onError: (error) => {
      addToast(`שגיאה בהוספת המתכון: ${error.message}`, 'error');
    },
  });


  const ingredients = watch("ingredients");


  // פונקציית עזר להמרת מרכיבים
  const transformIngredients = (ingredients) =>
    ingredients
      .map((ingredient) => {
        const parts = ingredient.trim().split(/\s+/);
        let amount = parts[0];
        let name = parts.slice(1).join(" ");
        if (isNaN(parseFloat(amount))) {
          amount = "1";
          name = ingredient.trim();
        }
        return {
          name: name || "Unknown Ingredient",
          amount: amount,
          unit: "",
        };
      })
      .filter((ingredient) => ingredient.name.trim() !== "");

  // שליחת טופס
  const onSubmit = useCallback(async (data) => {
    const formData = new FormData();
    const ingredientsArray = transformIngredients(data.ingredients);
    Object.keys(data).forEach((key) => {
      if (key === "image") {
        if (data.image && data.image[0]) formData.append("image", data.image[0]);
      } else if (key === "ingredients") {
        formData.append("ingredients", JSON.stringify(ingredientsArray));
      } else if (Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    addRecipeMutation.mutate(formData, {
      onSuccess: () => {
        reset(defaultValues); // ניקוי טופס
        setImagePreview(null);
      },
    });
  }, [addRecipeMutation, reset]);


  // הוספת מרכיב
  const handleAddIngredient = useCallback(() => {
    setValue("ingredients", [...ingredients, ""]);
  }, [ingredients, setValue]);

  // הסרת מרכיב
  const handleRemoveIngredient = useCallback((index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setValue("ingredients", newIngredients);
  }, [ingredients, setValue]);


  // טיפול בשינוי תמונה
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", e.target.files);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setValue("image", null);
      setImagePreview(null);
    }
  }, [setValue]);


  // רנדר דינמי של שדות מרכיבים
  const renderIngredientInputs = useCallback(() => (
    <div className={styles.ingredientsSection}>
      <label htmlFor="ingredient-input-0">מרכיבים:</label>
      {ingredients.length === 0 && (
        <div className={styles.emptyIngredients} role="alert">לא הוזן אף מרכיב</div>
      )}
      {ingredients.map((ingredient, index) => (
        <div key={index} className={styles.ingredientRow}>
          <Controller
            name={`ingredients.${index}`}
            control={control}
            rules={{ required: "מרכיב לא יכול להיות ריק" }}
            render={({ field }) => (
              <input
                {...field}
                id={`ingredient-input-${index}`}
                placeholder={`מרכיב ${index + 1}`}
                autoComplete="off"
                aria-label={`מרכיב ${index + 1}`}
                aria-invalid={!!errors.ingredients?.[index]}
              />
            )}
          />
          <button
            type="button"
            onClick={() => handleRemoveIngredient(index)}
            className={styles.removeIngredient}
            aria-label={`הסר מרכיב ${index + 1}`}
            tabIndex={0}
          >
            הסר
          </button>
          {errors.ingredients?.[index] && (
            <span className={styles.error} role="alert">{errors.ingredients[index]?.message}</span>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddIngredient}
        className={styles.addIngredient}
        aria-label="הוסף מרכיב"
        tabIndex={0}
      >
        הוסף מרכיב
      </button>
      {typeof errors.ingredients === 'object' && !Array.isArray(errors.ingredients) && errors.ingredients && (
        <span className={styles.error} role="alert">{errors.ingredients.message}</span>
      )}
    </div>
  ), [ingredients, control, errors.ingredients, handleAddIngredient, handleRemoveIngredient]);

  // const renderAllergenSelection = useCallback(() => (
  //   <div className={styles.allergensSection}>
  //     <label>אלרגנים:</label>
  //     <div className={styles.allergenGrid}>
  //       {allergens.map((allergen) => (
  //         <div key={allergen._id} className={styles.allergenItem}>
  //           <Controller
  //             name="allergens"
  //             control={control}
  //             render={({ field }) => (
  //               <label>
  //                 <input
  //                   type="checkbox"
  //                   onChange={(e) => {
  //                     const updatedAllergens = e.target.checked
  //                       ? [...field.value, allergen._id]
  //                       : field.value.filter((id) => id !== allergen._id);
  //                     field.onChange(updatedAllergens);
  //                   }}
  //                   checked={field.value.includes(allergen._id)}
  //                 />
  //                 {allergen.icon} {allergen.hebrewName}
  //               </label>
  //             )}
  //           />
  //           <div className={styles.allergenAlternatives}>
  //             <strong>תחליפים:</strong>
  //             <ul>
  //               {allergen.alternatives.map((alt, index) => (
  //                 <li key={index}>
  //                   {alt.name} - {alt.description}
  //                 </li>
  //               ))}
  //             </ul>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //     {errors.allergens && (
  //       <span className={styles.error}>{errors.allergens.message}</span>
  //     )}
  //   </div>
  // ), [allergens, control, errors.allergens]);

  // if (allergensLoading) return <div>טוען אלרגנים...</div>;

  // רנדר ראשי
  return (
    <div className={styles.addRecipeContainer}>
      <h2 className={styles.title}>הוספת מתכון חדש</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} autoComplete="off" aria-label="טופס הוספת מתכון">
        <FormField
          name="name"
          control={control}
          label="שם המתכון"
          error={errors.name}
          inputRef={nameInputRef}
          aria-required="true"
          aria-invalid={!!errors.name}
        />
        <FormField
          name="description"
          control={control}
          label="תיאור קצר"
          error={errors.description}
          as="textarea"
          aria-required="true"
          aria-invalid={!!errors.description}
        />
        {renderIngredientInputs()}
        <FormField
          name="instructions"
          control={control}
          label="הוראות הכנה"
          error={errors.instructions}
          as="textarea"
          aria-required="true"
          aria-invalid={!!errors.instructions}
        />
        <div className={styles.formRow}>
          <FormField
            name="preparationTime"
            control={control}
            label="זמן הכנה (דקות)"
            error={errors.preparationTime}
            type="number"
            aria-required="true"
            aria-invalid={!!errors.preparationTime}
          />
          <FormField
            name="cookingTime"
            control={control}
            label="זמן בישול (דקות)"
            error={errors.cookingTime}
            type="number"
            aria-required="true"
            aria-invalid={!!errors.cookingTime}
          />
          <FormField
            name="servings"
            control={control}
            label="מספר מנות"
            error={errors.servings}
            type="number"
            aria-required="true"
            aria-invalid={!!errors.servings}
          />
        </div>
        <div className={styles.formRow}>
          <FormField
            name="difficulty"
            control={control}
            label="רמת קושי"
            error={errors.difficulty}
            as="select"
            options={DIFFICULTY_LEVELS.map((level) => ({
              value: level,
              label: level,
            }))}
            aria-required="true"
            aria-invalid={!!errors.difficulty}
          />
          <FormField
            name="category"
            control={control}
            label="קטגוריה"
            error={errors.category}
            as="select"
            options={CATEGORIES.map((category) => ({
              value: category,
              label: category,
            }))}
            aria-required="true"
            aria-invalid={!!errors.category}
          />
        </div>
        {/* {renderAllergenSelection()} */}
        <ImageUpload
          onChange={handleImageChange}
          preview={imagePreview}
          error={errors.image}
          aria-label="העלה תמונה"
        />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={addRecipeMutation.isLoading}
          aria-busy={addRecipeMutation.isLoading}
        >
          {addRecipeMutation.isLoading ? (
            <span>
              <span className={styles.spinner} aria-hidden="true" />
              מוסיף מתכון...
            </span>
          ) : "הוסף מתכון"}
        </button>
        {addRecipeMutation.isError && (
          <div className={styles.error} style={{marginTop:8}} role="alert">
            {addRecipeMutation.error?.message || "אירעה שגיאה בהוספת המתכון"}
          </div>
        )}
      </form>
    </div>
  );
};


AddRecipe.propTypes = {};

export default memo(AddRecipe);