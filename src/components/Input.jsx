// Input.jsx
import React from 'react';
import styles from '../css/Input.module.css';

const Input = ({ placeholder, onChange, className }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={onChange}
      className={`${styles.input} ${className}`}
    />
  );
};

export default Input; // Change to default export
