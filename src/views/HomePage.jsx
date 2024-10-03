import React, { useState, useEffect, useRef } from "react";
import PokemonList from "../components/PokemonList";
import EvolutionModal from "../components/EvolutionModal";
import Loading from "../components/Loading";
import PokemonNavigationButtons from "../components/PokemonNavigationButtons";
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/main.module.css';

const HomePage = () => {
  const [selectedPokemonSpecies, setSelectedPokemonSpecies] = useState(null);
  const [previousPokemonList, setPreviousPokemonList] = useState([]);
  const [currentPokemonList, setCurrentPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);


  const fetchPokemon = async (id) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching Pokemon ${id}:`, error);
      return null;
    }
  };

  const fetchRandomPokemonList = async () => {
    try {
      const pokemonPromises = [];
      for (let i = 0; i < 12; i++) {
        const randomId = Math.floor(Math.random() * 898) + 1;
        pokemonPromises.push(fetchPokemon(randomId));
      }

      const results = await Promise.all(pokemonPromises);
      const validResults = results.filter((pokemon) => pokemon !== null);

      if (validResults.length === 0) {
        throw new Error("Could not fetch any Pokemon");
      }

      return validResults;
    } catch (error) {
      console.error("Error fetching Pokemon list:", error);
      setError("Failed to load Pokémon. Please try again.");
      return [];
    }
  };

   useEffect(() => {
    isMounted.current = true;
    updatePokemonList();

    const interval = setInterval(updatePokemonList, 45000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);

    const updatePokemonList = async () => {
      try {
        setListLoading(true);
        const newPokemonList = await fetchRandomPokemonList();

        if (newPokemonList.length > 0) {
          // Save current list as previous before updating
          if (currentPokemonList.length > 0) {
            setPreviousPokemonList(currentPokemonList);
          }

          // Update current list
          setCurrentPokemonList(newPokemonList);
        }
      } catch (error) {
        console.error("Error in updatePokemonList:", error);
        setError("Failed to update Pokemon list");
      } finally {
        setListLoading(false);
        setLoading(false);
      }
    };

    const handleNextPokemon = async () => {
      setListLoading(true);
      try {
        // Save current list as previous
        setPreviousPokemonList(currentPokemonList);

        // Fetch new Pokemon list
        const newPokemonList = await fetchRandomPokemonList();
        if (newPokemonList.length > 0) {
          setCurrentPokemonList(newPokemonList);
        }
      } catch (error) {
        console.error("Error fetching next Pokemon:", error);
        setError("Failed to load next Pokémon");
      } finally {
        setListLoading(false);
      }
    };



  const showEvolutionModal = async (pokemonId) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const speciesData = await response.json();
      setSelectedPokemonSpecies(speciesData);
    } catch (error) {
      console.error("Error fetching species data:", error);
      setError("Failed to load evolution data");
    }
  };

  const closeEvolutionModal = () => {
    setSelectedPokemonSpecies(null);
  };

  const handlePreviousPokemon = () => {
    if (previousPokemonList.length > 0) {
      // Swap current and previous lists
      const tempList = currentPokemonList;
      setCurrentPokemonList(previousPokemonList);
      setPreviousPokemonList(tempList);
    }
  };


  return (
    <div className="flex flex-col min-h-screen p-5">
      {loading && <Loading />}

      {error && (
        <div className="text-center p-5">
          <p className="text-red-500">{error}</p>
          <button
            onClick={updatePokemonList}
            className="px-5 py-2.5 mt-2.5 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {listLoading ? (
            <Loading />
          ) : (
            <>
              <PokemonList
                onShowEvolution={showEvolutionModal}
                onPokemonClick={(pokemonName) => (window.location.href = `/pokemon/${pokemonName}`)}
                pokemonList={currentPokemonList}
              />
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handlePreviousPokemon}
                  className="navButton"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPokemon}
                  className="navButton"
                >
                  Next
                </button>
              </div>
              {previousPokemonList.length > 0 && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Previous list contains {previousPokemonList.length} Pokémon
                </p>
              )}
            </>
          )}
          {selectedPokemonSpecies && (
            <EvolutionModal
              evolutionChainUrl={selectedPokemonSpecies.evolution_chain.url}
              onClose={closeEvolutionModal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
