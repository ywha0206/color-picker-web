import React, { useState, useEffect } from 'react';
import ColorPalette from './ColorPalette';
import HueSlider from './HueSlider';
import ColorCodeDisplay from './ColorCodeDisplay';
import { rgbToHex, hexToRgb, isValidHex, rgbToHsv, hsvToRgb, rgbToHsl, hslToRgb } from '../utils/colorUtils';
import '../styles/ColorPicker.css';

const ColorPicker = ({ onColorChange }) => {
  const [hue, setHue] = useState(135);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [selectedColor, setSelectedColor] = useState({ r: 0, g: 255, b: 64 });
  const [hexValue, setHexValue] = useState('#00FF40');
  const [baseSaturation, setBaseSaturation] = useState(100); // 기준 채도값 저장

  // 색상이 변경될 때마다 HEX 값 업데이트
  useEffect(() => {
    const hex = rgbToHex(selectedColor.r, selectedColor.g, selectedColor.b);
    setHexValue(hex);
    // 부모 컴포넌트에 색상 변경 알림
    if (onColorChange) {
      onColorChange(hex);
    }
  }, [selectedColor, onColorChange]);

  // HSL 값이 변경될 때 RGB 업데이트
  useEffect(() => {
    const newRgb = hslToRgb(hue, saturation, lightness);
    setSelectedColor(newRgb);
  }, [hue, saturation, lightness]);

  // 팔레트에서 색상 선택
  const handleColorSelect = (rgb) => {
    setSelectedColor(rgb);
    // 선택된 색상의 HSL 값 계산
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    setBaseSaturation(hsl.s); // 기준 채도값 업데이트
  };

  // 색조 슬라이더 변경
  const handleHueChange = (newHue) => {
    setHue(newHue);
  };

  // 채도 슬라이더 변경
  const handleSaturationChange = (newSaturation) => {
    setSaturation(newSaturation);
  };

  // 명도 슬라이더 변경
  const handleLightnessChange = (newLightness) => {
    setLightness(newLightness);
  };

  // 색상 코드에서 직접 색상 변경
  const handleColorCodeChange = (rgb) => {
    setSelectedColor(rgb);
    // 변경된 색상의 HSL 값 계산
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    setBaseSaturation(hsl.s); // 기준 채도값 업데이트
  };

  return (
    <div className="color-picker-container">
      <h1 className="color-picker-title">색상 선택도구</h1>
      
      <div className="palette-area">
        <ColorPalette 
          hue={hue}
          saturation={saturation}
          lightness={lightness}
          onColorSelect={handleColorSelect}
          selectedColor={selectedColor}
        />
      </div>

      <HueSlider 
        hue={hue}
        saturation={saturation}
        lightness={lightness}
        baseSaturation={baseSaturation}
        onHueChange={handleHueChange}
        onSaturationChange={handleSaturationChange}
        onLightnessChange={handleLightnessChange}
      />

      <ColorCodeDisplay 
        rgb={selectedColor}
        hex={hexValue}
        onColorChange={handleColorCodeChange}
      />
    </div>
  );
};

export default ColorPicker;
