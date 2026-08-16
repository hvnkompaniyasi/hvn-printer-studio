import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Studio from './components/Studio';
import { Home, Printer } from 'lucide-react';
import './App.css';

function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' or 'studio'
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Transition helper from showcase cards
  const handleOpenStudio = (template) => {
    setSelectedTemplate(template);
    setScreen('studio');
  };

  const handleNavToLanding = () => {
    setSelectedTemplate(null);
    setScreen('landing');
  };

  const handleNavToStudio = () => {
    setSelectedTemplate(null); // start blank
    setScreen('studio');
  };

  return (
    <>
      {/* Dynamic Animated Atmospheric Particles */}
      <div className="neon-particle particle-purple no-print" style={{ width: '400px', height: '400px', top: '10%', left: '-10%' }}></div>
      <div className="neon-particle particle-cyan no-print" style={{ width: '300px', height: '300px', bottom: '15%', right: '-5%' }}></div>
      <div className="neon-particle particle-purple no-print" style={{ width: '150px', height: '150px', bottom: '40%', left: '30%' }}></div>

      {/* Primary Screen Router */}
      {screen === 'landing' ? (
        <LandingPage onOpenStudio={handleOpenStudio} />
      ) : (
        <Studio initialTemplate={selectedTemplate} onBackToHome={handleNavToLanding} />
      )}

      {/* Floating sleeks glass bottom navbar */}
      <nav className="bottom-nav no-print">
        <button 
          className={`nav-item ${screen === 'landing' ? 'active' : ''}`}
          onClick={handleNavToLanding}
          title="Bosh sahifa"
        >
          <Home size={20} />
        </button>
        <button 
          className={`nav-item ${screen === 'studio' ? 'active' : ''}`}
          onClick={handleNavToStudio}
          title="Print Studio"
        >
          <Printer size={20} />
        </button>
      </nav>
    </>
  );
}

export default App;
