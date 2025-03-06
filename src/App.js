import React, { useState } from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import OfficeEscapeGame from './components/OfficeEscapeGame';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <div className="App">
      {!gameStarted ? (
        <LoadingScreen onStartGame={() => setGameStarted(true)} />
      ) : (
        <OfficeEscapeGame />
      )}
    </div>
  );
}

export default App;
