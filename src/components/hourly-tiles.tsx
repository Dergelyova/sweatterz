"use client";

import { type HourPoint, fmtHH } from "@/lib/weather-utils";
import { useState } from "react";

interface HourlyTileProps {
  hour: HourPoint;
  isSelected: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

function HourlyTile({ hour, isSelected, isCurrent, onClick }: HourlyTileProps) {
  const time = fmtHH(hour.time);
  
  return (
    <button
      onClick={onClick}
      className={`
        relative p-4 rounded-xl transition-all duration-150 hover-lift
        ${isCurrent 
          ? 'glass gradient-border' 
          : 'bg-card border border-card-border hover:border-foreground-muted/30'
        }
        ${isSelected ? 'ring-2 ring-blue/50' : ''}
      `}
    >
      {isCurrent && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue to-pink rounded-full"></div>
      )}
      
      <div className="text-center space-y-2">
        <div className="body-medium text-foreground text-sm">
          {time}
        </div>
        
        <div className="text-2xl font-bold text-foreground">
          {Math.round(hour.t)}°
        </div>
        
        <div className="grid grid-cols-2 gap-1 text-xs text-foreground-subtle">
          <div className="flex items-center justify-center space-x-1">
            <span>💧</span>
            <span>{hour.rh}%</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <span>🌬️</span>
            <span>{Math.round(hour.wind)}</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <span>☀️</span>
            <span>{hour.uv}</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <span>🌧️</span>
            <span>{hour.precip}%</span>
          </div>
        </div>
        
        {hour.precip > 60 && (
          <div className="text-xs text-pink font-medium">
            Дощ!
          </div>
        )}
      </div>
    </button>
  );
}

interface HourlyTilesProps {
  hours: HourPoint[];
  onHourSelect?: (hour: HourPoint) => void;
  maxTiles?: number;
}

export function HourlyTiles({ hours, onHourSelect, maxTiles = 16 }: HourlyTilesProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const currentTime = new Date();
  
  const displayHours = hours.slice(0, maxTiles);
  
  const handleTileClick = (hour: HourPoint, index: number) => {
    setSelectedIndex(index);
    onHourSelect?.(hour);
  };
  
  const getCurrentIndex = () => {
    const currentHour = currentTime.getHours();
    return displayHours.findIndex(hour => {
      const hourTime = new Date(hour.time).getHours();
      return hourTime === currentHour;
    });
  };
  
  const currentIndex = getCurrentIndex();
  
  if (!displayHours.length) {
    return (
      <div className="glass rounded-2xl p-6">
        <h3 className="heading text-lg text-foreground mb-4">Погода по годинах</h3>
        <div className="text-foreground-muted body">
          Немає даних про погоду
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="heading text-lg text-foreground">Погода по годинах</h3>
        <div className="text-xs text-foreground-subtle body">
          Натисніть для детального прогнозу
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {displayHours.map((hour, index) => (
          <HourlyTile
            key={hour.time}
            hour={hour}
            isSelected={selectedIndex === index}
            isCurrent={index === currentIndex}
            onClick={() => handleTileClick(hour, index)}
          />
        ))}
      </div>
      
      {selectedIndex !== null && (
        <div className="mt-4 p-4 bg-card-hover rounded-xl">
          <div className="body text-foreground-muted text-sm text-center">
            Вибрано: {fmtHH(displayHours[selectedIndex].time)} — 
            детальний прогноз для цього часу буде показано вище
          </div>
        </div>
      )}
      
      {hours.length > maxTiles && (
        <div className="mt-4 text-center">
          <button className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-150 body">
            Показати всі {hours.length} годин →
          </button>
        </div>
      )}
    </div>
  );
}