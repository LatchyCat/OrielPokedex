import React from 'react';
import { useBattleTeam } from '../contexts/BattleTeamContext';
import { Link } from 'react-router-dom';

const BattleTeamWidget = () => {
  const { battleTeam, removePokemonFromTeam } = useBattleTeam();

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '10px', width: '200px' }}>
      <h3>Your Battle Team</h3>
      {battleTeam.map(pokemon => (
        <div key={pokemon.id}>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: '50px' }} />
          <p>{pokemon.name}</p>
          <button onClick={() => removePokemonFromTeam(pokemon.id)}>Remove</button>
        </div>
      ))}
      {battleTeam.length === 0 && <p>No Pokémon in your team.</p>}
      {battleTeam.length > 0 && <Link to="/strategies">View Battle Strategies</Link>}
    </div>
  );
};

export default BattleTeamWidget;
