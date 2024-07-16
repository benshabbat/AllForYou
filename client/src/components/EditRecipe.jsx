import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import FormField from '../components/FormField';
import AllergenSelection from '../components/AllergenSelection';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useAllergens } from '../hooks/useAllergens';
import styles from './EditRecipe.module.css';

const recipeSchema = yup.object().shape({
  name: yup.string().required('שם המתכון הוא שדה חובה'),
  description: yup.string().required('תיאור קצר הוא שדה חובה'),
  ingredients: yup.string().required('רשימת המרכיבים היא שדה חובה'),
  instructions: yup.string().required('הוראות ההכנה הן שדה חובה'),
  preparationTime: yup.number().positive().integer().required('זמן הכנה הוא שדה חובה'),
  cookingTime: yup.number().positive().integer().required('זמן בישול הוא שדה חובה'),
  servings: yup.number().positive().integer().required('מספר מנות הוא שדה חובה'),
  difficulty: yup.string().oneOf(['קל', 'בינוני', 'מאתגר']).required('רמת קושי היא שדה חובה'),
  category: yup.string().oneOf(['מנה ראשונה', 'מנה עיקרית', 'קינוח', 'משקה', 'חטיף']).required('קטגוריה היא שדה חובה'),
  allergens: yup.array().of(yup.string()),
  image: yup.string().url('נא להזין כתובת URL תקינה לתמונה'),
});

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { allergens } = useAllergens();

  const { data: recipe, isLoading, error } = useQuery(['recipe', id], () =>
    api.get(`/recipes/${id}`).then((res) => res.data)
  );

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(recipeSchema),
  });

  useEffect(() => {
    if (recipe) {
      reset({
        ...recipe,
        ingredients: recipe.ingredients.join('\n'),
      });
    }
  }, [recipe, reset]);

  const updateMutation = useMutation(
    (updatedRecipe) => api.put(`/recipes/${id}`, updatedRecipe),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['recipe', id]);
        navigate(`/recipe/${id}`);
      },
    }
  );

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      ingredients: data.ingredients.split('\n').map((item) => item.trim()).filter(Boolean),
      preparationTime: Number(data.preparationTime),
      cookingTime: Number(data.cookingTime),
      servings: Number(data.servings),
    };
    updateMutation.mutate(formattedData);
  };

  if (isLoading) return <Loading message="טוען מתכון..." />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className={styles.editRecipeContainer}>
      <h2 className={styles.title}>עריכת מתכון</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormField name="name" control={control} label="שם המתכון" error={errors.name} />
        <FormField name="description" control={control} label="תיאור קצר" error={errors.description} as="textarea" />
        <FormField name="ingredients" control={control} label="מרכיבים (כל מרכיב בשורה חדשה)" error={errors.ingredients} as="textarea" />
        <FormField name="instructions" control={control} label="הוראות הכנה" error={errors.instructions} as="textarea" />
        <div className={styles.formRow}>
          <FormField name="preparationTime" control={control} label="זמן הכנה (דקות)" error={errors.preparationTime} type="number" />
          <FormField name="cookingTime" control={control} label="זמן בישול (דקות)" error={errors.cookingTime} type="number" />
          <FormField name="servings" control={control} label="מספר מנות" error={errors.servings} type="number" />
        </div>
        <FormField
          name="difficulty"
          control={control}
          label="רמת קושי"
          error={errors.difficulty}
          as="select"
          options={[
            { value: "קל", label: "קל" },
            { value: "בינוני", label: "בינוני" },
            { value: "מאתגר", label: "מאתגר" },
          ]}
        />
        <FormField
          name="category"
          control={control}
          label="קטגוריה"
          error={errors.category}
          as="select"
          options={[
            { value: "מנה ראשונה", label: "מנה ראשונה" },
            { value: "מנה עיקרית", label: "מנה עיקרית" },
            { value: "קינוח", label: "קינוח" },
            { value: "משקה", label: "משקה" },
            { value: "חטיף", label: "חטיף" },
          ]}
        />
        <AllergenSelection
          name="allergens"
          control={control}
          label="אלרגנים"
          error={errors.allergens}
          allergens={allergens || []}
        />
        <FormField name="image" control={control} label="קישור לתמונה" error={errors.image} placeholder="https://example.com/image.jpg" />
        <button type="submit" className={styles.submitButton} disabled={updateMutation.isLoading}>
          {updateMutation.isLoading ? "מעדכן מתכון..." : "עדכן מתכון"}
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;