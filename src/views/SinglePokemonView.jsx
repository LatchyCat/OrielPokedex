import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/SinglePokemonView.module.css';
import { useBattleTeam } from '../contexts/BattleTeamContext'; // Import the context

const SinglePokemonView = () => {
  const { name } = useParams(); // Get the pokemon name from the route parameter
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addPokemonToTeam } = useBattleTeam(); // Get the addPokemonToTeam function from the context

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemon(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]); // Make sure the parameter matches the route (should be "name")

  if (loading) {
    return <p>Loading Pokémon...</p>;
  }

  if (!pokemon) {
    return <p>Pokémon not found.</p>;
  }

  return (
    <div className={styles.pokemonContainer}>
      <div className={styles.pokemonCard}>
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className={styles.pokemonImage}
        />
        <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
        <div className={styles.pokemonInfo}>
          <p><strong>Height:</strong> {pokemon.height} decimetres</p>
          <p><strong>Weight:</strong> {pokemon.weight} hectograms</p>
          <p><strong>Base Experience:</strong> {pokemon.base_experience}</p>
          <p><strong>Abilities:</strong> {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
          <p><strong>Types:</strong> {pokemon.types.map(type => type.type.name).join(', ')}</p>
          <p><strong>Stats:</strong></p>
          <ul>
            {pokemon.stats.map(stat => (
              <li key={stat.stat.name}>
                {stat.stat.name}: {stat.base_stat}
              </li>
            ))}
          </ul>
        </div>
        <button className={styles.addButton} onClick={() => addPokemonToTeam(pokemon)}>Add to team</button>
      </div>
    </div>
  );
};

export default SinglePokemonView;
