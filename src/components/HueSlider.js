import React from 'react';
import '../styles/HueSlider.css';

const HueSlider = ({ hue, saturation, lightness, baseSaturation, onHueChange, onSaturationChange, onLightnessChange }) => {
  const handleHueChange = (e) => {
    onHueChange(parseInt(e.target.value));
  };

  const handleSaturationChange = (e) => {
    onSaturationChange(parseInt(e.target.value));
  };

  const handleLightnessChange = (e) => {
    onLightnessChange(parseInt(e.target.value));
  };

  return (
    <div className="slider-container">
      <div className="slider-group">
        <label className="slider-label">색조 (Hue)</label>
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={handleHueChange}
          className="hue-slider"
        />
      </div>
      
      <div className="slider-group">
        <label className="slider-label">채도 (Saturation)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={saturation}
          onChange={handleSaturationChange}
          className="saturation-slider"
          style={{
            background: `linear-gradient(to right, 
              hsl(${hue}, 0%, 50%), 
              hsl(${hue}, ${baseSaturation}%, 50%))`
          }}
        />
      </div>
      
      <div className="slider-group">
        <label className="slider-label">명도 (Lightness)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={lightness}
          onChange={handleLightnessChange}
          className="lightness-slider"
          style={{
            background: `linear-gradient(to right, 
              hsl(${hue}, ${saturation}%, 0%), 
              hsl(${hue}, ${saturation}%, 50%), 
              hsl(${hue}, ${saturation}%, 100%))`
          }}
        />
      </div>
    </div>
  );
};

export default HueSlider;
