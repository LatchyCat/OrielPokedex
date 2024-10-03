import React from 'react';
import styles from '../css/Button.module.css';

const Button = ({ children, onClick, className }) => {
  // Combine styles.button and any additional className prop
  const buttonClass = `${styles.button} ${className ? styles[className] : ''}`;

  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

export default Button;
