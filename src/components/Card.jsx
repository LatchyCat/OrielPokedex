import React from 'react';
import styles from '../css/Card.module.css';

// Card Component
export const Card = ({ children, className }) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {children}
    </div>
  );
};

// CardContent Component
export const CardContent = ({ children, className }) => {
  return (
    <div className={`${styles.cardContent} ${className}`}>
      {children}
    </div>
  );
};

// CardHeader Component
export const CardHeader = ({ title, className }) => {
  return (
    <div className={`${styles.cardHeader} ${className}`}>
      <h3>{title}</h3>
    </div>
  );
};
