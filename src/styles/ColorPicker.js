import React, { useState, useEffect } from 'react';
import ColorPalette from './ColorPalette';
import HueSlider from '../components/HueSlider';
import ColorCodeDisplay from './ColorCodeDisplay';
import { rgbToHex, hexToRgb, isValidHex } from '../utils/colorUtils';
import './ColorPicker.css';

const ColorPicker = ({ onColorChange }) => {
  const [hue, setHue] = useState(135);
  const [selectedColor, setSelectedColor] = useState({ r: 0, g: 255, b: 64 });
  const [hexValue, setHexValue] = useState('#00FF40');

  // 색상이 변경될 때마다 HEX 값 업데이트
  useEffect(() => {
    const hex = rgbToHex(selectedColor.r, selectedColor.g, selectedColor.b);
    setHexValue(hex);
    // 부모 컴포넌트에 색상 변경 알림
    if (onColorChange) {
      onColorChange(hex);
    }
  }, [selectedColor, onColorChange]);

  // HEX 입력값이 변경될 때 처리
  const handleHexChange = (hex) => {
    if (isValidHex(hex)) {
      const rgb = hexToRgb(hex);
      if (rgb) {
        setSelectedColor(rgb);
        setHexValue(hex);
      }
    } else {
      setHexValue(hex);
    }
  };

  // 팔레트에서 색상 선택
  const handleColorSelect = (rgb) => {
    setSelectedColor(rgb);
  };

  // 색상 슬라이더 변경
  const handleHueChange = (newHue) => {
    setHue(newHue);
  };

  return (
    <div className="color-picker-container">
      <h1 className="color-picker-title">색상 선택도구</h1>
      
      <div className="palette-area">
        <ColorPalette 
          hue={hue} 
          onColorSelect={handleColorSelect}
        />
      </div>

      <HueSlider 
        hue={hue} 
        onHueChange={handleHueChange}
      />

      <ColorCodeDisplay 
        rgb={selectedColor}
        hex={hexValue}
        onHexChange={handleHexChange}
      />
    </div>
  );
};

export default ColorPicker;
