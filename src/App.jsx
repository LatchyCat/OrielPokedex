import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './views/HomePage';
import AllPokemonView from './views/AllPokemonView';
import StrategiesPage from './views/PokemonStrategiesView';
import SinglePokemonView from './views/SinglePokemonView';
import GenerationView from './views/GenerationView';
import BattlePage from './views/BattlePage'; 
import TopNav from './components/TopNav';
import { BattleTeamProvider } from './contexts/BattleTeamContext';

function App() {
  return (
    <Router>
      <BattleTeamProvider>
        <TopNav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/all-pokemon" element={<AllPokemonView />} />
          <Route path="/strategies" element={<StrategiesPage />} />
          <Route path="/pokemon/:name" element={<SinglePokemonView />} />
          <Route path="/pokemon/generation/:generation" element={<GenerationView />} />
          <Route path="/battle" element={<BattlePage />} /> {/* Add the Battle route */}
        </Routes>
      </BattleTeamProvider>
    </Router>
  );
}

export default App;
