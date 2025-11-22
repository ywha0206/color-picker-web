import React, { useRef, useEffect, useState } from 'react';
import { rgbToHsl, rgbToHsv } from '../utils/colorUtils';
import '../styles/ColorPalette.css';

const ColorPalette = ({ hue, saturation, lightness, onColorSelect, selectedColor }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [indicatorPosition, setIndicatorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 컨테이너 크기에 맞춰 캔버스 크기 조정
    const containerWidth = container.offsetWidth;
    canvas.width = containerWidth;
    canvas.height = 120;

    const ctx = canvas.getContext('2d');
    drawPalette(ctx, canvas.width, canvas.height, hue, saturation, lightness);

    // 현재 색상 위치 계산 및 표시
    updateIndicatorPosition();
  }, [hue, saturation, lightness, selectedColor]);

  const drawPalette = (ctx, width, height, hue, saturation, lightness) => {
    // 수평 그라디언트 (흰색에서 선택된 색상으로)
    const gradientH = ctx.createLinearGradient(0, 0, width, 0);
    gradientH.addColorStop(0, "white");
    gradientH.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
    ctx.fillStyle = gradientH;
    ctx.fillRect(0, 0, width, height);

    // 수직 그라디언트 (투명에서 검은색으로)
    const gradientV = ctx.createLinearGradient(0, 0, 0, height);
    gradientV.addColorStop(0, "rgba(0,0,0,0)");
    gradientV.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = gradientV;
    ctx.fillRect(0, 0, width, height);
  };

  const updateIndicatorPosition = () => {
    if (!selectedColor) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // RGB를 HSV로 변환하여 위치 계산 (팔레트 모델에 적합)
    // const hsl = rgbToHsl(selectedColor.r, selectedColor.g, selectedColor.b); // ❌
    const hsv = rgbToHsv(selectedColor.r, selectedColor.g, selectedColor.b); // ✅

    // x: 채도(Saturation)에 따른 위치 (0%는 흰색/회색, 100%는 순색)
    const x = (hsv.s / 100) * canvas.width; // S (채도) 사용

    // y: 값(Value)에 따른 위치
    // V=100%일 때 순색(캔버스 상단), V=0%일 때 검은색(캔버스 하단)
    const y = ((100 - hsv.v) / 100) * canvas.height; // V (값) 사용

    setIndicatorPosition({ x, y });
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = pixel;

    onColorSelect({ r, g, b });
  };

  return (
    <div ref={containerRef} className="palette-container">
      <canvas
        ref={canvasRef}
        className="color-palette"
        onClick={handleCanvasClick}
      />
      <div
        className="color-indicator"
        style={{
          left: indicatorPosition.x,
          top: indicatorPosition.y
        }}
      />
    </div>
  );
};

export default ColorPalette;