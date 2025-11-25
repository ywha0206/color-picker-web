import React, { useState, useEffect } from 'react';
import { rgbToCmyk, rgbToHsv, rgbToHsl, hsvToRgb, hslToRgb, cmykToRgb, clampRgb, clampHsv, clampHsl, clampCmyk, hexToRgb } from '../utils/colorUtils';
import '../styles/ColorCodeDisplay.css';

const ColorCodeDisplay = ({ rgb, hex, onColorChange }) => {

    // 1. HEX 입력용 임시 상태
    const [tempHex, setTempHex] = useState(hex);
    const [isHandlingBlur, setIsHandlingBlur] = useState(false);
    
    // 2. 모든 숫자 입력 필드를 위한 임시 상태 (입력 중인 값을 문자열로 보존)
    const [tempValues, setTempValues] = useState({
        rgb: { r: rgb.r.toString(), g: rgb.g.toString(), b: rgb.b.toString() },
        cmyk: { 
            c: Math.round(rgbToCmyk(rgb.r, rgb.g, rgb.b).c).toString(),
            m: Math.round(rgbToCmyk(rgb.r, rgb.g, rgb.b).m).toString(),
            y: Math.round(rgbToCmyk(rgb.r, rgb.g, rgb.b).y).toString(),
            k: Math.round(rgbToCmyk(rgb.r, rgb.g, rgb.b).k).toString(),
        },
        hsv: { 
            h: Math.round(rgbToHsv(rgb.r, rgb.g, rgb.b).h).toString(),
            s: Math.round(rgbToHsv(rgb.r, rgb.g, rgb.b).s).toString(),
            v: Math.round(rgbToHsv(rgb.r, rgb.g, rgb.b).v).toString(),
        },
        hsl: { 
            h: Math.round(rgbToHsl(rgb.r, rgb.g, rgb.b).h).toString(),
            s: Math.round(rgbToHsl(rgb.r, rgb.g, rgb.b).s).toString(),
            l: Math.round(rgbToHsl(rgb.r, rgb.g, rgb.b).l).toString(),
        },
    });

    // 3. prop 기반 실시간 계산 (현재의 "진실된" 색상 코드)
    const currentCmykFloat = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const currentHsvFloat = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const currentHslFloat = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // 4. 외부 색상 변경 시, 모든 임시 상태 초기화 및 HEX 동기화
    useEffect(() => {
        if (isHandlingBlur) { return; }

        setTempHex(hex);
        
        setTempValues({
            rgb: { r: rgb.r.toString(), g: rgb.g.toString(), b: rgb.b.toString() },
            cmyk: {
                c: Math.round(currentCmykFloat.c).toString(),
                m: Math.round(currentCmykFloat.m).toString(),
                y: Math.round(currentCmykFloat.y).toString(),
                k: Math.round(currentCmykFloat.k).toString(),
            },
            hsv: {
                h: Math.round(currentHsvFloat.h).toString(),
                s: Math.round(currentHsvFloat.s).toString(),
                v: Math.round(currentHsvFloat.v).toString(),
            },
            hsl: {
                h: Math.round(currentHslFloat.h).toString(),
                s: Math.round(currentHslFloat.s).toString(),
                l: Math.round(currentHslFloat.l).toString(),
            },
        });
    }, [rgb, hex, isHandlingBlur,
        currentCmykFloat.c, currentCmykFloat.m, currentCmykFloat.y, currentCmykFloat.k,
        currentHsvFloat.h, currentHsvFloat.s, currentHsvFloat.v,
        currentHslFloat.h, currentHslFloat.s, currentHslFloat.l
    ]); 

    // 5. 공통된 onChange 핸들러: 입력 중에는 로컬 상태만 문자열로 업데이트
    const handleChange = (model, component, value) => {
        setTempValues(prev => ({
            ...prev,
            [model]: {
                ...prev[model],
                [component]: value
            }
        }));
    };

    // 6. RGB Blur 핸들러: 포커스 해제 시에만 부모 업데이트
    const handleRgbBlur = () => {
        setIsHandlingBlur(true);

        const finalRgb = { 
            r: parseInt(tempValues.rgb.r, 10) || 0,
            g: parseInt(tempValues.rgb.g, 10) || 0,
            b: parseInt(tempValues.rgb.b, 10) || 0,
        };
        const clampedRgb = clampRgb(finalRgb.r, finalRgb.g, finalRgb.b);
        
        // 내부 tempValues를 클램프된 최종 값으로 업데이트 (깜빡임/튕김 방지)
        setTempValues(prev => ({
            ...prev,
            rgb: { 
                r: clampedRgb.r.toString(), 
                g: clampedRgb.g.toString(), 
                b: clampedRgb.b.toString() 
            }
        }));
        
        // 부모에게 최종 RGB만 전달
        onColorChange(clampedRgb);

        setTimeout(() => {
            setIsHandlingBlur(false);
        }, 0);
    };

    // 7. CMYK Blur 핸들러
    const handleCmykBlur = () => {
        setIsHandlingBlur(true);

        const { c, m, y, k } = tempValues.cmyk;
        const intC = parseInt(c, 10) || 0;
        const intM = parseInt(m, 10) || 0;
        const intY = parseInt(y, 10) || 0;
        const intK = parseInt(k, 10) || 0;
        
        const clampedCmyk = clampCmyk(intC, intM, intY, intK);
        const newRgb = cmykToRgb(clampedCmyk.c, clampedCmyk.m, clampedCmyk.y, clampedCmyk.k);
        
        // 내부 tempValues를 클램프된 최종 값으로 업데이트
        setTempValues(prev => ({
            ...prev,
            cmyk: { 
                c: clampedCmyk.c.toString(), 
                m: clampedCmyk.m.toString(), 
                y: clampedCmyk.y.toString(), 
                k: clampedCmyk.k.toString() 
            }
        }));

        onColorChange(newRgb);

        setTimeout(() => {
            setIsHandlingBlur(false);
        }, 0);
    };
    
    // 8. HSV Blur 핸들러 
    const handleHsvBlur = () => {
        setIsHandlingBlur(true);

        const { h, s, v } = tempValues.hsv;
        const intH = parseInt(h, 10) || 0;
        const intS = parseInt(s, 10) || 0;
        const intV = parseInt(v, 10) || 0;
        
        const clampedHsv = clampHsv(intH, intS, intV);
        const newRgb = hsvToRgb(clampedHsv.h, clampedHsv.s, clampedHsv.v);
        
        // 내부 tempValues를 클램프된 최종 값으로 업데이트
        setTempValues(prev => ({
            ...prev,
            hsv: { 
                h: clampedHsv.h.toString(), 
                s: clampedHsv.s.toString(), 
                v: clampedHsv.v.toString() 
            }
        }));

        onColorChange(newRgb);

        setTimeout(() => {
            setIsHandlingBlur(false);
        }, 0);
    };

    // 9. HSL Blur 핸들러
    const handleHslBlur = () => {
        setIsHandlingBlur(true);
        
        const { h, s, l } = tempValues.hsl;
        const intH = parseInt(h, 10) || 0;
        const intS = parseInt(s, 10) || 0;
        const intL = parseInt(l, 10) || 0;
        
        const clampedHsl = clampHsl(intH, intS, intL);
        const newRgb = hslToRgb(clampedHsl.h, clampedHsl.s, clampedHsl.l);
        
        // 내부 tempValues를 클램프된 최종 값으로 업데이트
        setTempValues(prev => ({
            ...prev,
            hsl: { 
                h: clampedHsl.h.toString(), 
                s: clampedHsl.s.toString(), 
                l: clampedHsl.l.toString() 
            }
        }));

        onColorChange(newRgb);

        setTimeout(() => {
            setIsHandlingBlur(false);
        }, 0);
    };

    // 10. HEX Change 핸들러
    const handleHexChange = (value) => {
        setTempHex(value);
        if (/^#([0-9A-Fa-f]{6})$/.test(value)) {
            const newRgb = hexToRgb(value);
            onColorChange(newRgb);
        }
    };

    const handleCopy = (value, format) => {
        let textToCopy = value;
        if (format === 'rgb') {
            textToCopy = `${tempValues.rgb.r}, ${tempValues.rgb.g}, ${tempValues.rgb.b}`;
        } else if (format === 'cmyk') {
            textToCopy = `${tempValues.cmyk.c}, ${tempValues.cmyk.m}, ${tempValues.cmyk.y}, ${tempValues.cmyk.k}`;
        } else if (format === 'hsv') {
            textToCopy = `${tempValues.hsv.h}, ${tempValues.hsv.s}, ${tempValues.hsv.v}`;
        } else if (format === 'hsl') {
            textToCopy = `${tempValues.hsl.h}, ${tempValues.hsl.s}, ${tempValues.hsl.l}`;
        }
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert(`${textToCopy}가 클립보드에 복사되었습니다.`);
            })
            .catch(err => {
                console.error('클립보드 복사 실패:', err);
                alert('클립보드 복사 실패. 콘솔을 확인하세요.');
            });
    };

    return (
        <div className="color-code-container">
            <div className="hex-input-container">
                <input
                    type="text"
                    value={tempHex} 
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="hex-input"
                    placeholder="#000000"
                />
                <button onClick={() => handleCopy(tempHex, 'hex')} className="copy-button">
                    Copy
                </button>
            </div>
            
            <div className="color-input-group">
                {/* RGB Input */}
                <div className="color-input-row">
                    <span className="color-input-label">RGB</span>
                    <input 
                        type="number" min="0" max="255" 
                        value={tempValues.rgb.r} // 임시 상태 값 사용
                        onChange={(e) => handleChange('rgb', 'r', e.target.value)} // 임시 상태 업데이트
                        onBlur={handleRgbBlur} // 포커스 해제 시 부모 업데이트 및 내부 상태 확정
                        className="color-input" 
                    />
                    <input 
                        type="number" min="0" max="255" 
                        value={tempValues.rgb.g} 
                        onChange={(e) => handleChange('rgb', 'g', e.target.value)} 
                        onBlur={handleRgbBlur} 
                        className="color-input" 
                    />
                    <input 
                        type="number" min="0" max="255" 
                        value={tempValues.rgb.b} 
                        onChange={(e) => handleChange('rgb', 'b', e.target.value)} 
                        onBlur={handleRgbBlur} 
                        className="color-input" 
                    />
                    <button onClick={() => handleCopy(tempHex, 'rgb')} className="copy-button">
                        📋
                    </button>
                </div>
                
                {/* CMYK Input */}
                <div className="color-input-row">
                    <span className="color-input-label">CMYK</span>
                    {/* onChange 시 임시 상태 업데이트, onBlur 시 내부 상태 확정 및 부모 업데이트 */}
                    <input type="number" min="0" max="100" value={tempValues.cmyk.c} onChange={(e) => handleChange('cmyk', 'c', e.target.value)} onBlur={handleCmykBlur} className="color-input" />
                    <input type="number" min="0" max="100" value={tempValues.cmyk.m} onChange={(e) => handleChange('cmyk', 'm', e.target.value)} onBlur={handleCmykBlur} className="color-input" />
                    <input type="number" min="0" max="100" value={tempValues.cmyk.y} onChange={(e) => handleChange('cmyk', 'y', e.target.value)} onBlur={handleCmykBlur} className="color-input" />
                    <input type="number" min="0" max="100" value={tempValues.cmyk.k} onChange={(e) => handleChange('cmyk', 'k', e.target.value)} onBlur={handleCmykBlur} className="color-input" />
                    <button onClick={() => handleCopy(tempHex, 'cmyk')} className="copy-button">
                        📋
                    </button>
                </div>
                
                {/* HSV Input */}
                <div className="color-input-row">
                    <span className="color-input-label">HSV</span>
                    {/* onChange 시 임시 상태 업데이트, onBlur 시 내부 상태 확정 및 부모 업데이트 */}
                    <input type="number" min="0" max="360" value={tempValues.hsv.h} onChange={(e) => handleChange('hsv', 'h', e.target.value)} onBlur={handleHsvBlur} className="color-input" />
                    <input type="number" min="0" max="100" value={tempValues.hsv.s} onChange={(e) => handleChange('hsv', 's', e.target.value)} onBlur={handleHsvBlur} className="color-input" />
                    <input type="number" min="0" max="100" value={tempValues.hsv.v} onChange={(e) => handleChange('hsv', 'v', e.target.value)} onBlur={handleHsvBlur} className="color-input" />
                    <button onClick={() => handleCopy(tempHex, 'hsv')} className="copy-button">
                        📋
                    </button>
                </div>
                
                {/* HSL Input */}
                <div className="color-input-row">
                    <span className="color-input-label">HSL</span>
                    {/* onChange 시 임시 상태 업데이트, onBlur 시 내부 상태 확정 및 부모 업데이트 */}
                    <input type="number" min="0" max="360" value={tempValues.hsl.h} onChange={(e) => handleChange('hsl', 'h', e.target.value)} onBlur={handleHslBlur} className="color-input" />
                    <input type="number" min="0" max="100" value={tempValues.hsl.s} onChange={(e) => handleChange('hsl', 's', e.target.value)} onBlur={handleHslBlur} className="color-input" />
                    <input type="number" min="0" max="100" value={tempValues.hsl.l} onChange={(e) => handleChange('hsl', 'l', e.target.value)} onBlur={handleHslBlur} className="color-input" />
                    <button onClick={() => handleCopy(tempHex, 'hsl')} className="copy-button">
                        📋
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ColorCodeDisplay;