import React from 'react';
import styles from './SearchInputs.module.css';

const InputGroup = ({ name, value, onChange, placeholder }) => (
  <div className={styles.inputGroup}>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={styles.input}
    />
  </div>
);

const SelectGroup = ({ name, value, onChange, options }) => (
  <div className={styles.inputGroup}>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={styles.select}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const SearchInputs = ({ searchParams, handleChange, categories, difficultyLevels }) => (
  <div className={styles.inputsContainer}>
    <InputGroup 
      name="keyword"
      value={searchParams.keyword}
      onChange={handleChange}
      placeholder="חיפוש לפי מילת מפתח"
    />
    <SelectGroup 
      name="category"
      value={searchParams.category}
      onChange={handleChange}
      options={[{ value: "", label: "כל הקטגוריות" }, ...categories.map(c => ({ value: c, label: c }))]}
    />
    <SelectGroup 
      name="difficulty"
      value={searchParams.difficulty}
      onChange={handleChange}
      options={[{ value: "", label: "כל רמות הקושי" }, ...difficultyLevels.map(d => ({ value: d, label: d }))]}
    />
  </div>
);

export default SearchInputs;