import React from 'react';

const PokemonNavigationButtons = ({
  previousPokemonList,
  onPreviousPokemon,
  onNextPokemon,
  className
}) => {
  return (
    <div className={`pokemonNavigation ${className || ''}`}>
      <button
        onClick={onPreviousPokemon}
        disabled={previousPokemonList.length === 0}
        className={`pokemonButton previousButton ${previousPokemonList.length === 0 ? 'disabledButton' : ''}`}
      >
        {previousPokemonList.length > 0 ? 'Show Previous Pokémon' : 'No Previous Pokémon'}
      </button>

      <button
        onClick={onNextPokemon}
        className={`pokemonButton nextButton`}
      >
        Show Next Pokémon
      </button>
    </div>
  );
};

export default PokemonNavigationButtons;
