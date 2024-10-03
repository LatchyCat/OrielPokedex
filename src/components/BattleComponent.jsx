import React, { useEffect, useState } from 'react';
import { getPokemonByName, getMoveByName } from '../utils/pokeApiUtils'; // Import necessary functions

const BattleComponent = ({ playerPokemonName, opponentPokemonName }) => {
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [opponentPokemon, setOpponentPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemon = async (name) => {
      const data = await getPokemonByName(name);
      setPlayerPokemon(data);
    };

    const fetchOpponentPokemon = async (name) => {
      const data = await getPokemonByName(name);
      setOpponentPokemon(data);
    };

    fetchPokemon(playerPokemonName);
    fetchOpponentPokemon(opponentPokemonName);
  }, [playerPokemonName, opponentPokemonName]);

  const handleAttack = async (moveName) => {
    const moveData = await getMoveByName(moveName);
    // Handle attack logic here
  };

  return (
    <div>
      {playerPokemon && opponentPokemon ? (
        <div>
          <h2>Battle!</h2>
          <div>
            <h3>{playerPokemon.name}</h3>
            {/* Display player Pokémon details */}
            <button onClick={() => handleAttack(playerPokemon.moves[0].move.name)}>Attack</button>
          </div>
          <div>
            <h3>{opponentPokemon.name}</h3>
            {/* Display opponent Pokémon details */}
          </div>
        </div>
      ) : (
        <p>Loading Pokémon data...</p>
      )}
    </div>
  );
};

export default BattleComponent;
