import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../css/EvolutionModal.module.css';

const EvolutionModal = ({ evolutionChainUrl, onClose }) => {
  const [evolutionData, setEvolutionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvolution = async () => {
      try {
        setLoading(true);
        const response = await fetch(evolutionChainUrl);
        const data = await response.json();
        setEvolutionData(data);
      } catch (error) {
        console.error("Error fetching evolution data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvolution();
  }, [evolutionChainUrl]);

  const extractEvolutionChain = (chain) => {
    const evolutions = [];

    const addToChain = (evolution) => {
      evolutions.push({
        name: evolution.species.name,
        id: evolution.species.url.split('/')[6]
      });

      if (evolution.evolves_to.length > 0) {
        evolution.evolves_to.forEach(addToChain);
      }
    };

    addToChain(chain);
    return evolutions;
  };

  const handlePokemonClick = (pokemonName) => {
    navigate(`/pokemon/${pokemonName}`);
    onClose(); // Close the modal after navigation
  };

  if (loading) {
    return (
      <div className={styles.modal}>
        <p>Loading Evolution Chain...</p>
      </div>
    );
  }

  if (!evolutionData) {
    return (
      <div className={styles.modal}>
        <p>Failed to load evolution data.</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }

  const evolutionChain = extractEvolutionChain(evolutionData.chain);

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Evolution Chain</h2>
        <div className={styles.evolutionChain}>
          {evolutionChain.map((pokemon, index) => (
            <div
              key={pokemon.id}
              className={`${styles.evolutionStage} ${styles.clickable}`}
              onClick={() => handlePokemonClick(pokemon.name)}
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                alt={pokemon.name}
              />
              <p>{pokemon.name}</p>
              {index < evolutionChain.length - 1 && <span className={styles.arrow}>→</span>}
            </div>
          ))}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EvolutionModal;
