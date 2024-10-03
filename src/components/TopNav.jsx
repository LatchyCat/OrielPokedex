import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/TopNav.module.css';

const TopNav = () => {
  const [randomPokemon, setRandomPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [previouslySearched, setPreviouslySearched] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomPokemon = async () => {
      const randomId = Math.floor(Math.random() * 151) + 1;
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        setRandomPokemon(response.data);
      } catch (error) {
        console.error('Error fetching random Pokémon:', error);
      }
    };

    fetchRandomPokemon();
    const intervalId = setInterval(fetchRandomPokemon, 8000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = async (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length > 0) {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=151`);
        const filteredResults = response.data.results
          .filter(pokemon => pokemon.name.includes(term))
          .slice(0, 5); // Limit to 5 results for cleaner UI
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = async (pokemonName) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const pokemonData = {
        name: pokemonName,
        id: response.data.id,
      };

      setPreviouslySearched(prev => [
        pokemonData,
        ...prev.filter(p => p.name !== pokemonName).slice(0, 4)
      ]);

      navigate(`/pokemon/${pokemonName}`);
      setSearchTerm('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    }
  };

  return (
    <nav className={styles.topNav}>
      <div className={styles.leftSection}>
        <Link to="/" className={styles.homeLink}>
          {randomPokemon && (
            <div className={styles.randomPokemon}>
              <img
                src={randomPokemon.sprites.front_default}
                alt={randomPokemon.name}
                className={styles.randomPokemonImg}
              />
              <div className={styles.homeBanner}>HOME</div>
            </div>
          )}
        </Link>
      </div>

      <div className={styles.searchSection}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Pokémon..."
          className={styles.searchInput}
        />
        {searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.map((pokemon, index) => (
              <div
                key={index}
                className={styles.searchResultItem}
                onClick={() => handleResultClick(pokemon.name)}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`}
                  alt={pokemon.name}
                  className={styles.pokemonResultImg}
                />
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.rightSection}>
        <button className={styles.navButton} onClick={() => navigate('/all-pokemon')}>
          Pokédex
        </button>
        <button className={styles.navButton} onClick={() => navigate('/strategies')}>
          Strategies
        </button>
      </div>
    </nav>
  );
};

export default TopNav;
