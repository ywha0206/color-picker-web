import React from 'react';
import '../styles/ColorPreview.css';

const ColorPreview = ({ color }) => {
  return (
    <div 
      className="color-preview" 
      style={{ backgroundColor: color }}
      title={`선택된 색상: ${color}`}
    />
  );
};

export default ColorPreview;
