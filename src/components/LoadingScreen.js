import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onStartGame }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + Math.random() * 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        return newProgress;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="loading">
      <h1>SEVERANCE: OFFICE ESCAPE</h1>
      <p>Loading game assets...</p>
      <div className="loading-bar">
        <div 
          className="loading-progress" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="intro-text">
        You are an office worker at Lumon Industries. Trapped in an endless maze of 
        sterile white hallways, you must find your way to the black elevator hallway 
        to escape. But beware of Mr. Milcheeks, who will reset your progress if he 
        catches you.
      </div>
      <button 
        className={`start-button ${isReady ? 'ready' : ''}`}
        onClick={onStartGame}
        disabled={!isReady}
      >
        START GAME
      </button>
    </div>
  );
};

export default LoadingScreen;
