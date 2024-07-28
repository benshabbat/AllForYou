import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRecipes, deleteRecipe } from '../store/recipe/recipeSlice';
import RecipeCard from '../components/recipe/recipeCard/RecipeCard';
import ErrorMessage from '../components/ErrorMessage';
import {Modal,Loading} from '../components/common';
import {useToast} from '../components/common/toast/Toast';
import { FaPlus, FaSort, FaFilter } from 'react-icons/fa';
import styles from './MyRecipes.module.css';

const MyRecipes = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { userRecipes, isLoading, error } = useSelector((state) => state.recipes);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserRecipes(user.id));
    }
  }, [dispatch, user?.id]);

  const handleSort = useCallback((e) => {
    const [newSortBy, newSortOrder] = e.target.value.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }, []);

  const handleFilter = useCallback((e) => {
    setFilterCategory(e.target.value);
  }, []);

  const openDeleteModal = useCallback((recipe) => {
    setRecipeToDelete(recipe);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setRecipeToDelete(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (recipeToDelete) {
      dispatch(deleteRecipe(recipeToDelete._id))
        .unwrap()
        .then(() => {
          addToast('המתכון נמחק בהצלחה', 'success');
          closeDeleteModal();
        })
        .catch((error) => {
          addToast(`שגיאה במחיקת המתכון: ${error}`, 'error');
        });
    }
  }, [dispatch, recipeToDelete, addToast, closeDeleteModal]);

  const sortedAndFilteredRecipes = userRecipes
    .filter(recipe => !filterCategory || recipe.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        return sortOrder === 'desc' ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'name') {
        return sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      }
      return 0;
    });

  if (isLoading) return <Loading message="טוען את המתכונים שלך..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={styles.myRecipesContainer}>
      <h1 className={styles.title}>המתכונים שלי</h1>
      <Link to="/add-recipe" className={styles.addRecipeButton}>
        <FaPlus /> הוסף מתכון חדש
      </Link>
      
      <div className={styles.controls}>
        <div className={styles.sortContainer}>
          <label htmlFor="sort" className={styles.sortLabel}><FaSort /> מיין לפי: </label>
          <select
            id="sort"
            value={`${sortBy}-${sortOrder}`}
            onChange={handleSort}
            className={styles.sortSelect}
          >
            <option value="createdAt-desc">חדש ביותר</option>
            <option value="createdAt-asc">ישן ביותר</option>
            <option value="name-asc">שם (א-ת)</option>
            <option value="name-desc">שם (ת-א)</option>
          </select>
        </div>
        
        <div className={styles.filterContainer}>
          <label htmlFor="filter" className={styles.filterLabel}><FaFilter /> סנן לפי קטגוריה: </label>
          <select
            id="filter"
            value={filterCategory}
            onChange={handleFilter}
            className={styles.filterSelect}
          >
            <option value="">כל הקטגוריות</option>
            <option value="עיקריות">עיקריות</option>
            <option value="קינוחים">קינוחים</option>
            <option value="מנות ראשונות">מנות ראשונות</option>
            <option value="סלטים">סלטים</option>
          </select>
        </div>
      </div>

      {sortedAndFilteredRecipes.length > 0 ? (
        <div className={styles.recipeGrid}>
          {sortedAndFilteredRecipes.map(recipe => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe} 
              showActions={true}
              onDelete={() => openDeleteModal(recipe)}
            />
          ))}
        </div>
      ) : (
        <p className={styles.noRecipes}>
          {filterCategory
            ? `אין מתכונים בקטגוריה "${filterCategory}".`
            : 'עדיין לא הוספת מתכונים. '} 
          <Link to="/add-recipe">הוסף את המתכון הראשון שלך!</Link>
        </p>
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        title="אישור מחיקת מתכון"
        onConfirm={confirmDelete}
      >
        <p>האם אתה בטוח שברצונך למחוק את המתכון "{recipeToDelete?.name}"?</p>
        <p>פעולה זו אינה הפיכה.</p>
      </Modal>
    </div>
  );
};

export default MyRecipes;