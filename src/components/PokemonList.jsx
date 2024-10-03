import React from "react";
import styles from '../css/PokemonList.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const statIconMap = {
  hp: "fas fa-heart",
  attack: "fas fa-crossed-swords",
  defense: "fas fa-shield-alt",
  "special-attack": "fas fa-magic",
  "special-defense": "fas fa-shield-virus",
  speed: "fas fa-bolt",
};

const PokemonList = ({ onShowEvolution, onPokemonClick, pokemonList }) => {
  if (!Array.isArray(pokemonList) || pokemonList.length === 0) {
    return null;
  }

  const getStatColor = (statName) => {
    switch (statName) {
      case 'hp':
        return 'red'; // For HP (Health)
      case 'attack':
        return '#ff7f00'; // For Attack
      case 'defense':
        return '#00bfff'; // For Defense
      case 'special-attack':
        return 'purple'; // For Special Attack
      case 'special-defense':
        return '#228b22'; // For Special Defense
      case 'speed':
        return 'gold'; // For Speed
      default:
        return '#666'; // Default color
    }
  };

  return (
    <div className={styles.pokemonList}>
      {pokemonList.map((pokemon) => (
        <div key={pokemon.id || Math.random()} className={styles.pokemonCard}>
          <div className={styles.cardContent} onClick={() => onPokemonClick(pokemon.name)}>
            <h2 className={styles.pokemonName}>{pokemon.name}</h2>
            {pokemon.sprites && pokemon.sprites.front_default && (
              <img
                className={styles.pokemonImage}
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                loading="lazy"
              />
            )}
            <div className={styles.statsContainer}>
              <p className={styles.statsTitle}>Stats</p>
              <ul className={styles.statsList}>
              {pokemon.stats && pokemon.stats.map((stat) => (
                    <li key={stat.stat.name} className={styles.statItem}>
                      <span className={styles.statIcon} style={{ color: getStatColor(stat.stat.name) }}>
                        {stat.stat.name === 'attack' && <i className="fas fa-dumbbell"></i>}
                        {stat.stat.name === 'hp' && <i className="fas fa-heart"></i>}
                        {stat.stat.name === 'defense' && <i className="fas fa-shield-alt"></i>}
                        {stat.stat.name === 'special-attack' && <i className="fas fa-magic"></i>}
                        {stat.stat.name === 'special-defense' && <i className="fas fa-shield-virus"></i>}
                        {stat.stat.name === 'speed' && <i className="fas fa-bolt"></i>}
                      </span>
                      <span className={styles.statName}>
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <span className={styles.statValue}>{stat.base_stat}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <button
            className={styles.evolutionButton}
            onClick={(e) => {
              e.stopPropagation();
              onShowEvolution(pokemon.id);
            }}
          >
            See Evolutions
          </button>
        </div>
      ))}
    </div>
  );
};

export default PokemonList;
