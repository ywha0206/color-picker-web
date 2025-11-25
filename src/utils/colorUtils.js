// 색상 변환 유틸리티 함수들

/**
 * RGB를 HEX로 변환
 * @param {number} r - Red 값 (0-255)
 * @param {number} g - Green 값 (0-255)
 * @param {number} b - Blue 값 (0-255)
 * @returns {string} HEX 색상 코드
 */
export const rgbToHex = (r, g, b) => {
  return "#" + [r, g, b]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("").toUpperCase();
};

/**
 * HEX를 RGB로 변환
 * @param {string} hex - HEX 색상 코드
 * @returns {object} RGB 객체 {r, g, b}
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * RGB를 CMYK로 변환
 * @param {number} r - Red 값 (0-255)
 * @param {number} g - Green 값 (0-255)
 * @param {number} b - Blue 값 (0-255)
 * @returns {object} CMYK 객체 {c, m, y, k}
 */
export const rgbToCmyk = (r, g, b) => {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  const k = Math.min(c, m, y);
  
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  
  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);
  
  return {
        c: c * 100,
        m: m * 100,
        y: y * 100,
        k: k * 100
    };
};

/**
 * RGB를 HSV로 변환
 * @param {number} r - Red 값 (0-255)
 * @param {number} g - Green 값 (0-255)
 * @param {number} b - Blue 값 (0-255)
 * @returns {object} HSV 객체 {h, s, v}
 */
export const rgbToHsv = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h, s = (max === 0 ? 0 : d / max), v = max;
  
  if (max === min) h = 0;
  else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return { 
    h: h * 360, 
    s: s * 100, 
    v: v * 100 
  };
};

/**
 * RGB를 HSL로 변환
 * @param {number} r - Red 값 (0-255)
 * @param {number} g - Green 값 (0-255)
 * @param {number} b - Blue 값 (0-255)
 * @returns {object} HSL 객체 {h, s, l}
 */
export const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return { 
    h: h * 360,
    s: s * 100, 
    l: l * 100 
  };
};

/**
 * HEX 색상 코드 유효성 검사
 * @param {string} hex - HEX 색상 코드
 * @returns {boolean} 유효한 HEX 코드인지 여부
 */
export const isValidHex = (hex) => {
  return /^#([0-9A-Fa-f]{6})$/.test(hex);
};

/**
 * HSV를 RGB로 변환
 * @param {number} h - Hue 값 (0-360)
 * @param {number} s - Saturation 값 (0-100)
 * @param {number} v - Value 값 (0-100)
 * @returns {object} RGB 객체 {r, g, b}
 */
export const hsvToRgb = (h, s, v) => {
  h /= 360;
  s /= 100;
  v /= 100;
  
  const c = v * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = v - c;
  
  let r, g, b;
  
  if (h < 1/6) {
    r = c; g = x; b = 0;
  } else if (h < 2/6) {
    r = x; g = c; b = 0;
  } else if (h < 3/6) {
    r = 0; g = c; b = x;
  } else if (h < 4/6) {
    r = 0; g = x; b = c;
  } else if (h < 5/6) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
};

/**
 * HSL를 RGB로 변환
 * @param {number} h - Hue 값 (0-360)
 * @param {number} s - Saturation 값 (0-100)
 * @param {number} l - Lightness 값 (0-100)
 * @returns {object} RGB 객체 {r, g, b}
 */
export const hslToRgb = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  
  let r, g, b;
  
  if (h < 1/6) {
    r = c; g = x; b = 0;
  } else if (h < 2/6) {
    r = x; g = c; b = 0;
  } else if (h < 3/6) {
    r = 0; g = c; b = x;
  } else if (h < 4/6) {
    r = 0; g = x; b = c;
  } else if (h < 5/6) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
};

/**
 * CMYK를 RGB로 변환
 * @param {number} c - Cyan 값 (0-100)
 * @param {number} m - Magenta 값 (0-100)
 * @param {number} y - Yellow 값 (0-100)
 * @param {number} k - Key 값 (0-100)
 * @returns {object} RGB 객체 {r, g, b}
 */
export const cmykToRgb = (c, m, y, k) => {
  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;
  
  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));
  
  return { r, g, b };
};

/**
 * RGB 값을 유효 범위로 제한
 * @param {number} r - Red 값
 * @param {number} g - Green 값
 * @param {number} b - Blue 값
 * @returns {object} 제한된 RGB 객체 {r, g, b}
 */
export const clampRgb = (r, g, b) => {
  return {
    r: Math.max(0, Math.min(255, Math.round(r))),
    g: Math.max(0, Math.min(255, Math.round(g))),
    b: Math.max(0, Math.min(255, Math.round(b)))
  };
};

/**
 * HSV 값을 유효 범위로 제한
 * @param {number} h - Hue 값
 * @param {number} s - Saturation 값
 * @param {number} v - Value 값
 * @returns {object} 제한된 HSV 객체 {h, s, v}
 */
export const clampHsv = (h, s, v) => {
  return {
    h: Math.max(0, Math.min(360, Math.round(h))),
    s: Math.max(0, Math.min(100, Math.round(s))),
    v: Math.max(0, Math.min(100, Math.round(v)))
  };
};

/**
 * HSL 값을 유효 범위로 제한
 * @param {number} h - Hue 값
 * @param {number} s - Saturation 값
 * @param {number} l - Lightness 값
 * @returns {object} 제한된 HSL 객체 {h, s, l}
 */
export const clampHsl = (h, s, l) => {
  return {
    h: Math.max(0, Math.min(360, Math.round(h))),
    s: Math.max(0, Math.min(100, Math.round(s))),
    l: Math.max(0, Math.min(100, Math.round(l)))
  };
};

/**
 * CMYK 값을 유효 범위로 제한
 * @param {number} c - Cyan 값
 * @param {number} m - Magenta 값
 * @param {number} y - Yellow 값
 * @param {number} k - Key 값
 * @returns {object} 제한된 CMYK 객체 {c, m, y, k}
 */
export const clampCmyk = (c, m, y, k) => {
  return {
    c: Math.max(0, Math.min(100, Math.round(c))),
    m: Math.max(0, Math.min(100, Math.round(m))),
    y: Math.max(0, Math.min(100, Math.round(y))),
    k: Math.max(0, Math.min(100, Math.round(k)))
  };
};
