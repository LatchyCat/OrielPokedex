import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import styles from '../css/GenerationView.module.css';

const legendaryPokemons = {
  1: [{ name: 'mewtwo', location: 'Cerulean Cave' }],
  2: [{ name: 'lugia', location: 'Whirl Islands' }, { name: 'ho-oh', location: 'Bell Tower' }],
  3: [{ name: 'rayquaza', location: 'Sky Pillar' }, { name: 'deoxys', location: 'Various' }],
  4: [{ name: 'dialga', location: 'Spear Pillar' }, { name: 'palkia', location: 'Spear Pillar' }, { name: 'giratina', location: 'Distortion World' }],
  5: [{ name: 'reshiram', location: 'Dragonspiral Tower' }, { name: 'zekrom', location: 'Dragonspiral Tower' }],
  6: [{ name: 'xerneas', location: 'Cave of Emptiness' }, { name: 'yveltal', location: 'Cave of Emptiness' }],
  7: [{ name: 'solgaleo', location: 'Altar of the Sunne' }, { name: 'lunala', location: 'Altar of the Moone' }],
  8: [{ name: 'zamazenta', location: 'The Crown Tundra' }, { name: 'zacion', location: 'The Crown Tundra' }],
};

const GenerationView = () => {
  const { generation } = useParams();
  const navigate = useNavigate();
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenerationPokemon = async () => {
      setLoading(true);
      try {
        // Fetching Pokémon species for the selected generation
        const response = await axios.get(`https://pokeapi.co/api/v2/generation/${generation}`);

        console.log(`Response data for generation ${generation}:`, response.data); // Debugging

        const speciesList = response.data.pokemon_species;

        // Check if speciesList is empty
        if (!speciesList || speciesList.length === 0) {
          console.warn(`No Pokémon species found for generation ${generation}`);
          setPokemonList([]); // Set empty if no species found
          return;
        }

        // Sort species by ID to ensure correct order
        speciesList.sort((a, b) => {
          const idA = parseInt(a.url.split('/').slice(-2, -1)[0]);
          const idB = parseInt(b.url.split('/').slice(-2, -1)[0]);
          return idA - idB;
        });

        // Fetch each Pokémon's details to get images (limited to first 20 for performance)
        const pokemonDataPromises = speciesList.slice(0, 20).map((species) => {
          const pokemonId = species.url.split('/').slice(-2, -1)[0];
          return axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        });

        const pokemonDataResponses = await Promise.all(pokemonDataPromises);

        // Format the Pokémon list
        const formattedPokemonList = pokemonDataResponses.map((res) => ({
          name: res.data.name,
          id: res.data.id,
          image: res.data.sprites.front_default,
        }));

        console.log(`Formatted Pokémon list for generation ${generation}:`, formattedPokemonList); // Debugging

        setPokemonList(formattedPokemonList);
      } catch (error) {
        console.error("Error fetching generation Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenerationPokemon();
  }, [generation]);

  const handlePokemonClick = (pokemonName) => {
    navigate(`/pokemon/${pokemonName}`);
  };

  const handleBackClick = () => {
    navigate(-1); // This will take the user back to the previous page
  };

  if (loading) {
    return <Loading />;
  }

  const legends = legendaryPokemons[generation] || [];

  return (
    <div className={styles.generationContainer}>
      <div className={styles.headerContainer}>
        <button
          onClick={handleBackClick}
          className={styles.backButton}
        >
          Back to all pokemon
        </button>
        <h1>Generation {generation} Pokémon</h1>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.pokemonGrid}>
          {pokemonList.length > 0 ? (
            pokemonList.map((pokemon) => (
              <div
                key={pokemon.id}
                className={styles.pokemonCard}
                onClick={() => handlePokemonClick(pokemon.name)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={pokemon.image} // Use the fetched image URL
                  alt={pokemon.name}
                  className={styles.pokemonImage}
                />
                <p className={styles.pokemonName}>{pokemon.name}</p>
              </div>
            ))
          ) : (
            <p>No Pokémon found for this generation.</p>
          )}
        </div>

        {/* Right Section for Legendary Pokémon */}
        <div className={styles.legendaryContainer}>
          <h2>Legendary Pokémon</h2>
          {legends.length > 0 ? (
            legends.map((legend, index) => (
              <div
                key={index}
                className={styles.legendaryCard}
                onClick={() => handlePokemonClick(legend.name)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${legend.name === 'mewtwo' ? 150 : legend.name === 'lugia' ? 249 : legend.name === 'ho-oh' ? 250 : legend.name === 'rayquaza' ? 384 : legend.name === 'deoxys' ? 386 : legend.name === 'dialga' ? 483 : legend.name === 'palkia' ? 484 : legend.name === 'giratina' ? 487 : legend.name === 'reshiram' ? 643 : legend.name === 'zekrom' ? 644 : legend.name === 'xerneas' ? 716 : legend.name === 'yveltal' ? 717 : legend.name === 'solgaleo' ? 791 : legend.name === 'lunala' ? 792 : legend.name === 'zamazenta' ? 888 : 889}.png`}
                  alt={legend.name}
                  className={styles.pokemonImage}
                />
                <div className={styles.pokemonInfo}>
                  <p className={styles.legendaryName}>{legend.name.charAt(0).toUpperCase() + legend.name.slice(1)}</p>
                  <p>Location: {legend.location}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No legendary Pokémon available for this generation.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerationView;
