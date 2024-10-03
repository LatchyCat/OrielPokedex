// Footer.jsx
import React from 'react';
import BattleTeamDisplay from './BattleTeamDisplay'; // Import the BattleTeamDisplay
import styles from '../css/Footer.module.css'; // Create and use a separate CSS file for footer styles

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <BattleTeamDisplay />
      </div>
    </footer>
  );
};

export default Footer;
