"use client";

import { useState, useRef, useEffect } from "react";

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (value: number) => string;
}

export function Slider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  unit = "",
  formatValue
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  };

  const updateValue = (e: React.MouseEvent | MouseEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newValue = min + (percentage / 100) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    
    onChange(Math.max(min, Math.min(max, steppedValue)));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-foreground-muted body uppercase tracking-wide">
          {label}
        </label>
        <div className="text-sm body-medium text-white font-semibold">
          {displayValue}
        </div>
      </div>
      
      <div 
        ref={sliderRef}
        className="relative h-3 bg-card border border-card-border rounded-full cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        {/* Track fill */}
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue to-pink rounded-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Thumb */}
        <div 
          className={`
            absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 
            w-5 h-5 bg-white border-2 border-blue rounded-full shadow-lg
            transition-all duration-150 hover:scale-110
            ${isDragging ? 'scale-110 shadow-xl' : ''}
          `}
          style={{ left: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-foreground-subtle">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}