import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllergens, createAllergen, updateAllergen, deleteAllergen } from '../store/slices/allergenSlice';
import styles from './AllergenManagement.module.css';

const AllergenManagement = () => {
  const dispatch = useDispatch();
  const { allergens, loading, error } = useSelector(state => state.allergens);
  const [selectedAllergen, setSelectedAllergen] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    hebrewName: '',
    icon: '',
    description: '',
    severity: 'Medium'
  });

  useEffect(() => {
    dispatch(fetchAllergens());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAllergen) {
      dispatch(updateAllergen({ id: selectedAllergen._id, allergenData: formData }));
    } else {
      dispatch(createAllergen(formData));
    }
    resetForm();
  };

  const handleEdit = (allergen) => {
    setSelectedAllergen(allergen);
    setFormData(allergen);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this allergen?')) {
      dispatch(deleteAllergen(id));
    }
  };

  const resetForm = () => {
    setSelectedAllergen(null);
    setFormData({
      name: '',
      hebrewName: '',
      icon: '',
      description: '',
      severity: 'Medium'
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.allergenManagement}>
      <h2>ניהול אלרגנים</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="שם באנגלית"
          required
        />
        <input
          type="text"
          name="hebrewName"
          value={formData.hebrewName}
          onChange={handleInputChange}
          placeholder="שם בעברית"
          required
        />
        <input
          type="text"
          name="icon"
          value={formData.icon}
          onChange={handleInputChange}
          placeholder="אייקון"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="תיאור"
          required
        />
        <select
          name="severity"
          value={formData.severity}
          onChange={handleInputChange}
        >
          <option value="Low">נמוך</option>
          <option value="Medium">בינוני</option>
          <option value="High">גבוה</option>
        </select>
        <button type="submit">{selectedAllergen ? 'עדכן' : 'הוסף'} אלרגן</button>
        {selectedAllergen && (
          <button type="button" onClick={resetForm}>בטל עריכה</button>
        )}
      </form>
      <ul className={styles.allergenList}>
        {allergens.map(allergen => (
          <li key={allergen._id} className={styles.allergenItem}>
            <span>{allergen.hebrewName} ({allergen.name})</span>
            <button onClick={() => handleEdit(allergen)}>ערוך</button>
            <button onClick={() => handleDelete(allergen._id)}>מחק</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllergenManagement;