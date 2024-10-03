import React, { useEffect, useState } from "react";
import { useBattleTeam } from '../contexts/BattleTeamContext';
import axios from "axios";
import styles from '../css/PokemonStrategiesView.module.css';
import PokemonBattleComparison from '../components/PokemonBattleComparison';

const PokemonStrategiesView = () => {
  const { battleTeam } = useBattleTeam();
  const [comparisonResults, setComparisonResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const compareTeamStrengths = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(battleTeam.map(async (pokemon) => {
        const response = await axios.get(`https://pokeapi.co/api/v2/type/${pokemon.types[0].type.name}`);
        return {
          name: pokemon.name,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
          weaknesses: response.data.damage_relations.double_damage_from.map(type => type.name),
        };
      }));
      setComparisonResults(results);
    } catch (err) {
      setError("Failed to fetch Pokémon data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (battleTeam.length > 0) {
      compareTeamStrengths();
    }
  }, [battleTeam]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Battle Strategies</h1>
      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {battleTeam.length > 0 ? (
        <div>
          <h2 className={styles.subtitle}>Your Team's Strengths & Weaknesses</h2>
          {comparisonResults.map((result, index) => (
            <div key={index} className={styles.comparisonItem}>
              <img
                src={result.imageUrl}
                alt={result.name}
                className={styles.pokemonImage}
              />
              <div className={styles.infoContainer}>
                <h3>{result.name}</h3>
                <p className={styles.weaknessesText}>Weaknesses: {result.weaknesses.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noPokémonMessage}>No Pokémon in your team to compare.</p>
      )}
      <PokemonBattleComparison />
    </div>
  );
};

export default PokemonStrategiesView;
