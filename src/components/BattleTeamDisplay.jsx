import React from 'react';
import { useBattleTeam } from '../contexts/BattleTeamContext';
import styles from '../css/BattleTeamDisplay.module.css';

const BattleTeamDisplay = () => {
  const { battleTeam, removePokemonFromTeam } = useBattleTeam();

  return (
    <div className={styles.battleTeamContainer}>
      <h3>Your Battle Team</h3>
      <div className={styles.teamList}>
        {battleTeam.length === 0 ? (
          <p>No Pokémon in your team yet!</p>
        ) : (
          battleTeam.map((pokemon) => (
            <div key={pokemon.id} className={styles.pokemonItem}>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} // Adjusted for correct image URL
                alt={pokemon.name}
                className={styles.pokemonImage} // Ensure you have CSS for this class
              />
              <p>{pokemon.name}</p>
              <button onClick={() => removePokemonFromTeam(pokemon.id)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BattleTeamDisplay;
