import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../css/AllPokemonView.module.css";
import Loading from "../components/Loading"; // Import your Loading component

const AllPokemonView = () => {
  const [generationData, setGenerationData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define starter Pokémon for each generation
  const startersPerGeneration = {
    1: ["bulbasaur", "charmander", "squirtle"], // Generation 1
    2: ["chikorita", "cyndaquil", "totodile"], // Generation 2
    3: ["treecko", "torchic", "mudkip"], // Generation 3
    4: ["turtwig", "chimchar", "piplup"], // Generation 4
    5: ["snivy", "tepig", "oshawott"], // Generation 5
    6: ["chespin", "fennekin", "froakie"], // Generation 6
    7: ["rowlet", "litten", "popplio"], // Generation 7
    8: ["grookey", "scorbunny", "sobble"], // Generation 8
  };

  // Fetching generation data
  useEffect(() => {
    const fetchGenerations = async () => {
      setLoading(true);
      try {
        const generations = [];
        for (let i = 1; i <= 8; i++) {
          const response = await axios.get(`https://pokeapi.co/api/v2/generation/${i}`);

          // Map the starter Pokémon names to their corresponding data
          const starters = startersPerGeneration[i].map(starterName => {
            return response.data.pokemon_species.find(pokemon => pokemon.name === starterName);
          });

          generations.push({
            generation: i,
            starters: starters.filter(Boolean), // Filter out any undefined values
          });
        }
        setGenerationData(generations);
      } catch (error) {
        console.error("Error fetching generation data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenerations();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.pokemonContainer}>
      <h1 className={styles.title}>All Pokémon</h1>
      <div className={styles.generationsGrid}>
        {generationData.map((gen) => (
          <Link to={`/pokemon/generation/${gen.generation}`} key={gen.generation} className={styles.generationBox}>
            <h2>Generation {gen.generation}</h2>
            <div className={styles.starterContainer}>
              {gen.starters.map((starter) => {
                const starterId = starter.url.split('/')[6]; // Extracting ID from the URL
                return (
                  <div key={starter.name} className={styles.starter}>
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${starterId}.png`}
                      alt={starter.name}
                      className={styles.starterImage}
                    />
                    <p>{starter.name.charAt(0).toUpperCase() + starter.name.slice(1)}</p>
                  </div>
                );
              })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllPokemonView;
