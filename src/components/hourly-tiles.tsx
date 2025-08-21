"use client";

import { type HourPoint, fmtHH, getRunningCondition } from "@/lib/weather-utils";
import { useState } from "react";
import { t } from "@/lib/translations";

interface HourlyTileProps {
  hour: HourPoint;
  isSelected: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

function HourlyTile({ hour, isSelected, isCurrent, onClick, language = "UA" }: HourlyTileProps & { language?: "EN" | "UA" }) {
  const time = fmtHH(hour.time);
  const runningCondition = getRunningCondition(hour, language);
  
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`
          relative p-4 rounded-xl transition-all duration-150 hover-lift w-full
          ${isCurrent 
            ? 'glass gradient-border' 
            : `bg-card border ${runningCondition.borderColor} hover:border-foreground-muted/30`
          }
          ${isSelected ? 'ring-2 ring-blue/50' : ''}
        `}
      >
        {isCurrent && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue to-pink rounded-full"></div>
        )}
        
        {/* Running condition indicator */}
        <div className="absolute top-1 left-1 text-sm">
          {runningCondition.icon}
        </div>
        
        <div className="text-center space-y-2">
          <div className="body-medium text-foreground text-sm">
            {time}
          </div>
        
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground">
            {Math.round(hour.t)}°
          </div>
          {Math.abs(hour.feelsLike - hour.t) > 2 && (
            <div className="text-xs text-foreground-muted">
              {t("feelsLike", language)} {Math.round(hour.feelsLike)}°
            </div>
          )}
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
        
        <div className="h-5 flex items-center justify-center">
          {hour.precip > 60 && (
            <div className="text-xs text-pink font-medium">
              {t("rainAlert", language)}
            </div>
          )}
        </div>
      </div>
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-black/90 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        <div className="font-medium mb-2">{runningCondition.explanation}</div>
        <div className="space-y-1">
          {runningCondition.factors.map((factor, index) => (
            <div key={index} className="text-xs">{factor}</div>
          ))}
        </div>
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
      </div>
    </div>
  );
}

interface HourlyTilesProps {
  hours: HourPoint[];
  onHourSelect?: (hour: HourPoint) => void;
  maxTiles?: number;
  language?: "EN" | "UA";
}

export function HourlyTiles({ hours, onHourSelect, maxTiles = 16, language = "UA" }: HourlyTilesProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showAllHours, setShowAllHours] = useState(false);
  const currentTime = new Date();
  
  const displayHours = showAllHours ? hours : hours.slice(0, maxTiles);
  
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
        <h3 className="heading text-lg text-foreground mb-4">{t("hourlyWeather", language)}</h3>
        <div className="text-foreground-muted body">
          {t("noWeatherData", language)}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="heading text-lg text-foreground">{t("hourlyWeather", language)}</h3>
        <div className="text-xs text-foreground-subtle body">
          {t("clickForDetails", language)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {displayHours.map((hour, index) => (
          <HourlyTile
            key={hour.time}
            hour={hour}
            isSelected={selectedIndex === index}
            isCurrent={index === currentIndex}
            onClick={() => handleTileClick(hour, index)}
            language={language}
          />
        ))}
      </div>
      
      {selectedIndex !== null && selectedIndex < displayHours.length && displayHours[selectedIndex] && (
        <div className="mt-4 p-4 bg-card-hover rounded-xl">
          <div className="body text-foreground-muted text-sm text-center">
            {t("selected", language)}: {fmtHH(displayHours[selectedIndex].time)} — 
            {t("detailsWillShow", language)}
          </div>
        </div>
      )}
      
      {hours.length > maxTiles && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => {
              setShowAllHours(!showAllHours);
              setSelectedIndex(null); // Reset selection when toggling view
            }}
            className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-150 body hover:underline"
          >
            {showAllHours ? 
              (language === "EN" ? "Show less ←" : "Показати менше ←") : 
              t("showAllHours", language).replace("{count}", hours.length.toString())
            }
          </button>
        </div>
      )}
    </div>
  );
}