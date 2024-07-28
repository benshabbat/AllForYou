import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRecipes } from '../../hooks/useRecipes';
import styles from './RecipeForm.module.css';

const schema = yup.object().shape({
  name: yup.string().required('שם המתכון הוא שדה חובה'),
  description: yup.string().required('תיאור המתכון הוא שדה חובה'),
  ingredients: yup.array().of(yup.string()).min(1, 'יש להזין לפחות מרכיב אחד'),
  instructions: yup.string().required('הוראות ההכנה הן שדה חובה'),
});

const RecipeForm = () => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  });
  const { createRecipe } = useRecipes();

  const onSubmit = data => {
    createRecipe(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <input name="name" ref={register} placeholder="שם המתכון" />
      {errors.name && <span>{errors.name.message}</span>}

      <textarea name="description" ref={register} placeholder="תיאור המתכון" />
      {errors.description && <span>{errors.description.message}</span>}

      <input name="ingredients" ref={register} placeholder="מרכיבים (מופרדים בפסיקים)" />
      {errors.ingredients && <span>{errors.ingredients.message}</span>}

      <textarea name="instructions" ref={register} placeholder="הוראות הכנה" />
      {errors.instructions && <span>{errors.instructions.message}</span>}

      <button type="submit">הוסף מתכון</button>
    </form>
  );
};

export default RecipeForm;