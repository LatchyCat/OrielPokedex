import React, { createContext, useState, useContext } from 'react';

const BattleTeamContext = createContext();

export const useBattleTeam = () => useContext(BattleTeamContext);

export const BattleTeamProvider = ({ children }) => {
  const [battleTeam, setBattleTeam] = useState([]);

  const addToBattleTeam = (pokemon) => {
    if (battleTeam.length < 6 && !battleTeam.some(p => p.id === pokemon.id)) {
      setBattleTeam([...battleTeam, pokemon]);
    }
  };

  const removeFromBattleTeam = (pokemonId) => {
    setBattleTeam(battleTeam.filter(p => p.id !== pokemonId));
  };

  return (
    <BattleTeamContext.Provider value={{ battleTeam, addToBattleTeam, removeFromBattleTeam }}>
      {children}
    </BattleTeamContext.Provider>
  );
};
