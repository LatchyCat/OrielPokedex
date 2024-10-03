import React, { useState } from 'react';
import { useBattleTeam } from '../contexts/BattleTeamContext'; // Hook to access the battle team
import axios from 'axios';

const BattlePage = () => {
  const { battleTeam } = useBattleTeam(); // Get user's battle team
  const [opponent, setOpponent] = useState(null);
  const [battleResult, setBattleResult] = useState('');

  const fetchOpponent = async () => {
    const randomId = Math.floor(Math.random() * 898) + 1; // Random Pokémon ID from 1 to 898
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    setOpponent(response.data);
  };

  const handleBattle = (userPokemon) => {
    // Basic battle logic
    const userPower = userPokemon.base_experience; // Example attribute
    const opponentPower = opponent.base_experience; // Example attribute

    if (userPower > opponentPower) {
      setBattleResult(`${userPokemon.name} wins!`);
    } else if (userPower < opponentPower) {
      setBattleResult(`${opponent.name} wins!`);
    } else {
      setBattleResult("It's a tie!");
    }
  };

  return (
    <div>
      <h1>Pokémon Battle</h1>
      <button onClick={fetchOpponent}>Find Opponent</button>
      {opponent && (
        <div>
          <h2>Your Opponent:</h2>
          <p>{opponent.name}</p>
          <img src={opponent.sprites.front_default} alt={opponent.name} />
        </div>
      )}
      <h2>Your Team:</h2>
      {battleTeam.map((pokemon) => (
        <div key={pokemon.id}>
          <h3>{pokemon.name}</h3>
          <button onClick={() => handleBattle(pokemon)}>Battle!</button>
        </div>
      ))}
      {battleResult && <h2>Result: {battleResult}</h2>}
    </div>
  );
};

export default BattlePage;
