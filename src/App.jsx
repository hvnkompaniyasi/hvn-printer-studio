import React from 'react';
import Studio from './components/Studio';
import './App.css';

function App() {
  return (
    <>
      {/* Dynamic Animated Atmospheric Particles */}
      <div className="neon-particle particle-purple no-print" style={{ width: '400px', height: '400px', top: '10%', left: '-10%' }}></div>
      <div className="neon-particle particle-cyan no-print" style={{ width: '300px', height: '300px', bottom: '15%', right: '-5%' }}></div>
      <div className="neon-particle particle-purple no-print" style={{ width: '150px', height: '150px', bottom: '40%', left: '30%' }}></div>

      {/* Primary Workspace */}
      <Studio />
    </>
  );
}

export default App;
