import React, { createContext, useContext, useState } from 'react';

const BattleTeamContext = createContext();

export const useBattleTeam = () => useContext(BattleTeamContext);  // This exports the hook

export const BattleTeamProvider = ({ children }) => {
  const [battleTeam, setBattleTeam] = useState([]);

  const addPokemonToTeam = (pokemon) => {
    if (battleTeam.length < 6) {
      setBattleTeam([...battleTeam, pokemon]);
    } else {
      alert("You can only have 6 Pokémon on your team!");
    }
  };

  const removePokemonFromTeam = (pokemonId) => {
    setBattleTeam(battleTeam.filter(p => p.id !== pokemonId));
  };

  return (
    <BattleTeamContext.Provider value={{ battleTeam, addPokemonToTeam, removePokemonFromTeam }}>
      {children}
    </BattleTeamContext.Provider>
  );
};
