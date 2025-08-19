interface WeatherBadgeProps {
  icon: React.ReactNode;
  value: string | number;
  unit?: string;
  label: string;
}

function WeatherBadge({ icon, value, unit, label }: WeatherBadgeProps) {
  return (
    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-card border border-card-border">
      <div className="text-foreground-muted text-sm">{icon}</div>
      <div className="flex flex-col">
        <div className="body-medium text-white text-sm font-semibold">
          {value}{unit}
        </div>
        <div className="text-xs text-foreground-muted">{label}</div>
      </div>
    </div>
  );
}

import { Tooltip } from "./tooltip";
import { getWindInterpretation, getHumidityInterpretation, getFeelsLikeInterpretation } from "@/lib/running-interpretations";

interface WeatherBadgesProps {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  precipProbability: number;
  language?: "EN" | "UA";
}

export function WeatherBadges({ 
  temperature, 
  feelsLike,
  humidity, 
  windSpeed, 
  uvIndex, 
  precipProbability,
  language = "UA"
}: WeatherBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <WeatherBadge
        icon="🌡️"
        value={Math.round(temperature)}
        unit="°C"
        label="Temp"
      />
      
      <Tooltip content={getFeelsLikeInterpretation(temperature, feelsLike, language)}>
        <WeatherBadge
          icon="🌡️"
          value={Math.round(feelsLike)}
          unit="°C"
          label="Feels like"
        />
      </Tooltip>
      
      <Tooltip content={getHumidityInterpretation(humidity, temperature, language)}>
        <WeatherBadge
          icon="💧"
          value={humidity}
          unit="%"
          label="Humidity"
        />
      </Tooltip>
      
      <Tooltip content={getWindInterpretation(windSpeed, language)}>
        <WeatherBadge
          icon="🌬️"
          value={Math.round(windSpeed)}
          unit="km/h"
          label="Wind"
        />
      </Tooltip>
      
      <WeatherBadge
        icon="☀️"
        value={uvIndex}
        label="UV Index"
      />
      <WeatherBadge
        icon="🌧️"
        value={precipProbability}
        unit="%"
        label="Rain"
      />
    </div>
  );
}

interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient';
  size?: 'sm' | 'md';
}

export function Chip({ children, variant = 'default', size = 'md' }: ChipProps) {
  const baseClasses = "inline-flex items-center rounded-full font-medium transition-colors duration-150";
  const sizeClasses = size === 'sm' 
    ? "px-2 py-1 text-xs" 
    : "px-3 py-1.5 text-sm";
  
  const variantClasses = variant === 'gradient'
    ? "bg-gradient-to-r from-blue/20 to-pink/20 border border-blue/30 text-foreground"
    : "bg-card border border-card-border text-foreground-muted hover:text-foreground hover:border-foreground-muted";

  return (
    <span className={`${baseClasses} ${sizeClasses} ${variantClasses} body-medium`}>
      {children}
    </span>
  );
}