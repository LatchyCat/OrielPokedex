import styles from '../css/Loading.module.css';

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingImage}>
        <img
          src="https://media.tenor.com/-Uz6xHwMa4gAAAAi/snorlax-snorlax-pokemon.gif" // Replace with Pokémon loading graphic URL
          alt="Loading Pokémon"
        />
      </div>
      <p className={styles.loadingText}>Fetching new Pokémon, please wait...</p>
      <p className={styles.loadingSubtext}>Get ready for the next adventure!</p>
    </div>
  );
};

export default Loading;
