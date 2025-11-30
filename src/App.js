import React, { useState } from 'react';
import ColorPicker from './components/ColorPicker';
import './styles/App.css';
import Header from './components/Header';
import ToggleMenu from './components/ToggleMenu';

function App() {
  const [backgroundColor, setBackgroundColor] = useState('#00FF40');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const updateBackgroundColor = (color) => {
    setBackgroundColor(color);
  };
  
  return (
    <main>
      <Header
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
      />
      <div className="App" style={{ backgroundColor }}>
        <ColorPicker onColorChange={updateBackgroundColor} />
      </div>
      {(isMenuOpen) && (<ToggleMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu}/>)}
    </main>
  );
}

export default App;
