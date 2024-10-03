import React, { useState } from 'react';
import { useBattleTeam } from '../contexts/BattleTeamContext';
import axios from 'axios';
import { Card, CardContent } from './Card';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from '../css/PokemonBattleComparison.module.css';
import searchStyles from '../css/Search.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PokemonBattleComparison = () => {
  const { battleTeam, addPokemonToTeam, removePokemonFromTeam } = useBattleTeam();
  const [enemyTeam, setEnemyTeam] = useState(Array(6).fill(null));
  const [loading, setLoading] = useState(false);
  const [enemyLoading, setEnemyLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [enemySearchTerm, setEnemySearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [enemySearchResults, setEnemySearchResults] = useState([]);
  const [teamWeaknesses, setTeamWeaknesses] = useState({});

  const handleSearch = async (e, isEnemy = false) => {
    const term = e.target.value.toLowerCase();
    if (isEnemy) {
      setEnemySearchTerm(term);
    } else {
      setSearchTerm(term);
    }

    if (term.length < 2) {
      isEnemy ? setEnemySearchResults([]) : setSearchResults([]);
      return;
    }

    const loadingState = isEnemy ? setEnemyLoading : setLoading;
    loadingState(true);

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=151`);
      const filteredResults = response.data.results
        .filter(pokemon => pokemon.name.includes(term))
        .slice(0, 5);

      const resultsWithDetails = await Promise.all(
        filteredResults.map(async (pokemon) => {
          const detailResponse = await axios.get(pokemon.url);
          return {
            id: detailResponse.data.id,
            name: detailResponse.data.name,
            imageUrl: detailResponse.data.sprites.front_default,
            types: detailResponse.data.types,
            stats: detailResponse.data.stats,
          };
        })
      );

      isEnemy ? setEnemySearchResults(resultsWithDetails) : setSearchResults(resultsWithDetails);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      loadingState(false);
    }
  };

  const handleResultClick = (pokemon, isEnemy = false) => {
    if (isEnemy) {
      if (enemyTeam.filter(p => p !== null).length >= 6) {
        alert('Enemy team is full! Remove a Pokémon before adding a new one.');
        return;
      }
      if (enemyTeam.some(p => p && p.id === pokemon.id)) {
        alert('This Pokémon is already in the enemy team!');
        return;
      }
      const newEnemyTeam = [...enemyTeam];
      const emptySlot = newEnemyTeam.findIndex(slot => slot === null);
      if (emptySlot !== -1) {
        newEnemyTeam[emptySlot] = pokemon;
        setEnemyTeam(newEnemyTeam);
      }
      setEnemySearchTerm('');
      setEnemySearchResults([]);
    } else {
      if (battleTeam.length >= 6) {
        alert('Your team is full! Remove a Pokémon before adding a new one.');
        return;
      }
      if (battleTeam.some(p => p && p.id === pokemon.id)) {
        alert('This Pokémon is already in your team!');
        return;
      }
      addPokemonToTeam(pokemon);
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  const handleQuickTeamCreation = async (isEnemy = false) => {
    if (!isEnemy && battleTeam.length > 0) {
      alert('Please remove all Pokémon before creating a quick team.');
      return;
    }
    if (isEnemy && enemyTeam.some(p => p !== null)) {
      alert('Please remove all enemy Pokémon before creating a quick enemy team.');
      return;
    }

    const loadingState = isEnemy ? setEnemyLoading : setLoading;
    loadingState(true);

    const randomIds = Array.from({ length: 6 }, () => Math.floor(Math.random() * 151) + 1);

    try {
      const newTeam = await Promise.all(
        randomIds.map(async (id) => {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
          return {
            id: response.data.id,
            name: response.data.name,
            imageUrl: response.data.sprites.front_default,
            types: response.data.types,
            stats: response.data.stats,
          };
        })
      );

      if (isEnemy) {
        setEnemyTeam(newTeam);
      } else {
        newTeam.forEach(pokemon => addPokemonToTeam(pokemon));
      }
    } catch (error) {
      console.error('Error creating quick team:', error);
    } finally {
      loadingState(false);
    }
  };

  const removeFromEnemyTeam = (index) => {
    const newEnemyTeam = [...enemyTeam];
    newEnemyTeam[index] = null;
    setEnemyTeam(newEnemyTeam);
  };

  const TeamDisplay = ({ team, isEnemy }) => (
    <div className={`${styles.teamSection} ${isEnemy ? styles.enemyTeam : styles.userTeam}`}>
      <h2 className={styles.teamTitle}>
        {isEnemy ? 'Enemy Team' : 'Your Team'}
      </h2>
      <div className={styles.teamGrid}>
        {Array(6).fill(null).map((_, index) => {
          const pokemon = isEnemy ? enemyTeam[index] : team[index];
          return (
            <Card key={index}>
              <CardContent>
                {pokemon ? (
                  <div className="flex flex-col items-center">
                    <img src={pokemon.imageUrl} alt={pokemon.name} className="w-16 h-16" />
                    <h3 className="font-semibold mt-1 capitalize text-sm">{pokemon.name}</h3>
                    <div className="flex gap-1 mt-1">
                      {pokemon.types.map(type => (
                        <span key={type.type.name} className={`text-xs px-1 py-0.5 rounded ${styles[type.type.name]}`}>
                          {type.type.name}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs mt-1 w-full">
                      {pokemon.stats.map(stat => (
                        <div key={stat.stat.name} className="flex justify-between">
                          <span>{stat.stat.name}:</span>
                          <span>{stat.base_stat}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => isEnemy ? removeFromEnemyTeam(index) : removePokemonFromTeam(pokemon.id)}
                      className="mt-2 text-xs py-1 px-2 bg-red-500 hover:bg-red-600 text-white"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-28 bg-gray-100 rounded text-sm text-gray-500">
                    Empty slot
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pokémon Battle Comparison</h1>
      </div>

      <div className={styles.battleContainer}>
        {/* User Team Column */}
        <div className={styles.teamColumn}>
          <div className={`${styles.controlsSection} ${styles.userControls}`}>
            <h3>Your Battle Team</h3>
            <div className={styles.searchContainer}>
              <Input
                placeholder="Search for your Pokémon..."
                onChange={(e) => handleSearch(e, false)}
                value={searchTerm}
                disabled={loading}
              />
              {searchResults.length > 0 && (
                <div className={styles.searchResults}>
                  {searchResults.map((pokemon) => (
                    <div
                      key={pokemon.id}
                      className={styles.searchResult}
                      onClick={() => handleResultClick(pokemon, false)}
                    >
                      <img src={pokemon.imageUrl} alt={pokemon.name} className="w-10 h-10" />
                      <div className="ml-2">
                        <div className="font-semibold capitalize text-sm">{pokemon.name}</div>
                        <div className="flex gap-1">
                          {pokemon.types.map(type => (
                            <span key={type.type.name} className={`text-xs px-1 rounded ${styles[type.type.name]}`}>
                              {type.type.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={() => handleQuickTeamCreation(false)}
              disabled={loading || battleTeam.length > 0}
              className="w-full"
            >
              {loading ? 'Creating Team...' : 'Create Quick Team'}
            </Button>
          </div>
          <TeamDisplay team={battleTeam} isEnemy={false} />
        </div>

        {/* Enemy Team Column */}
        <div className={styles.teamColumn}>
          <div className={`${styles.controlsSection} ${styles.enemyControls}`}>
            <h3>Enemy Battle Team</h3>
            <div className={styles.searchContainer}>
              <Input
                placeholder="Search for enemy Pokémon..."
                onChange={(e) => handleSearch(e, true)}
                value={enemySearchTerm}
                disabled={enemyLoading}
              />
              {enemySearchResults.length > 0 && (
                <div className={styles.searchResults}>
                  {enemySearchResults.map((pokemon) => (
                    <div
                      key={pokemon.id}
                      className={styles.searchResult}
                      onClick={() => handleResultClick(pokemon, true)}
                    >
                      <img src={pokemon.imageUrl} alt={pokemon.name} className="w-10 h-10" />
                      <div className="ml-2">
                        <div className="font-semibold capitalize text-sm">{pokemon.name}</div>
                        <div className="flex gap-1">
                          {pokemon.types.map(type => (
                            <span key={type.type.name} className={`text-xs px-1 rounded ${styles[type.type.name]}`}>
                              {type.type.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={() => handleQuickTeamCreation(true)}
              disabled={enemyLoading || enemyTeam.some(p => p !== null)}
              className="w-full"
            >
              {enemyLoading ? 'Creating Enemy Team...' : 'Create Quick Enemy Team'}
            </Button>
          </div>
          <TeamDisplay team={enemyTeam} isEnemy={true} />
        </div>
      </div>
    </div>
  );
};

export default PokemonBattleComparison;
