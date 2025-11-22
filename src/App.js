import React, { useState } from 'react';
import ColorPicker from './components/ColorPicker';
import './styles/App.css';

function App() {
  const [backgroundColor, setBackgroundColor] = useState('#00FF40');

  // 배경색 변경 함수
  const updateBackgroundColor = (color) => {
    setBackgroundColor(color);
  };

  return (
    <div className="App" style={{ backgroundColor }}>
      <ColorPicker onColorChange={updateBackgroundColor} />
    </div>
  );
}

export default App;
