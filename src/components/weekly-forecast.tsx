"use client";

import { useState, useEffect } from "react";
import { comfortScore } from "@/lib/weather-utils";

interface WeeklyForecastResponse {
  timezone: string;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    uv_index_max: number[];
    wind_speed_10m_max: number[];
  };
}

interface DayForecast {
  date: string;
  day: string;
  tempMax: number;
  tempMin: number;
  uvMax: number;
  windMax: number;
  precipMax: number;
  bestTime: string;
  comfortScore: number;
}

interface WeeklyForecastProps {
  coords: { lat: number; lon: number } | null;
  preferredTime: "any" | "morning" | "day" | "evening";
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export function WeeklyForecast({ coords, preferredTime, selectedDate, onDateSelect }: WeeklyForecastProps) {
  const [forecast, setForecast] = useState<DayForecast[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeeklyForecast() {
      if (!coords) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", String(coords.lat));
        url.searchParams.set("longitude", String(coords.lon));
        url.searchParams.set(
          "daily",
          [
            "temperature_2m_max",
            "temperature_2m_min", 
            "precipitation_probability_max",
            "uv_index_max",
            "wind_speed_10m_max",
          ].join(",")
        );
        url.searchParams.set("forecast_days", "7");
        url.searchParams.set("timezone", "auto");

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Weekly forecast request failed");
        
        const data: WeeklyForecastResponse = await res.json();
        const daily = data.daily;

        const weeklyData: DayForecast[] = daily.time.map((date, i) => {
          const dateObj = new Date(date);
          const tempMax = daily.temperature_2m_max[i];
          const tempMin = daily.temperature_2m_min[i];
          const avgTemp = (tempMax + tempMin) / 2;
          const uvMax = daily.uv_index_max[i];
          const windMax = daily.wind_speed_10m_max[i];
          const precipMax = daily.precipitation_probability_max[i];

          // Calculate a simplified comfort score for the day
          const dayComfortScore = comfortScore(avgTemp, 60, windMax, uvMax, precipMax);

          // Determine best time based on preferences
          let bestTime = "08:00";
          if (preferredTime === "day") bestTime = "14:00";
          else if (preferredTime === "evening") bestTime = "19:00";

          return {
            date,
            day: dateObj.toLocaleDateString('uk-UA', { weekday: 'short' }),
            tempMax: Math.round(tempMax),
            tempMin: Math.round(tempMin),
            uvMax: Math.round(uvMax),
            windMax: Math.round(windMax),
            precipMax: Math.round(precipMax),
            bestTime,
            comfortScore: dayComfortScore,
          };
        });

        setForecast(weeklyData);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Помилка завантаження тижневого прогнозу");
      } finally {
        setLoading(false);
      }
    }

    fetchWeeklyForecast();
  }, [coords, preferredTime]);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6">
        <h3 className="heading text-lg text-foreground mb-4">Тижневий прогноз</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !forecast) {
    return (
      <div className="glass rounded-2xl p-6">
        <h3 className="heading text-lg text-foreground mb-4">Тижневий прогноз</h3>
        <div className="text-red-400 body text-center py-8">
          {error || "Не вдалося завантажити прогноз"}
        </div>
      </div>
    );
  }

  const getComfortLevel = (score: number) => {
    if (score < 8) return { text: "Відмінно", color: "text-green-400" };
    if (score < 15) return { text: "Добре", color: "text-blue" };
    if (score < 25) return { text: "Задовільно", color: "text-yellow-400" };
    return { text: "Складно", color: "text-red-400" };
  };

  return (
    <div className="glass rounded-2xl p-6 hover-lift">
      <h3 className="heading text-lg text-foreground mb-4">
        Тижневий прогноз для бігу
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {forecast.map((day, index) => {
          const isToday = index === 0;
          const isSelected = day.date === selectedDate;
          const comfort = getComfortLevel(day.comfortScore);
          
          return (
            <button 
              key={day.date}
              onClick={() => onDateSelect(day.date)}
              className={`
                p-4 rounded-xl border transition-all duration-150 hover:border-foreground-muted/30 hover:scale-105 cursor-pointer
                text-left w-full hover-lift
                ${isSelected 
                  ? 'bg-gradient-to-br from-blue/20 to-pink/20 border-blue/50 ring-2 ring-blue/30' 
                  : isToday 
                    ? 'bg-gradient-to-br from-blue/10 to-pink/10 border-blue/30' 
                    : 'bg-card border-card-border hover:bg-card-hover'
                }
              `}
            >
              <div className="text-center space-y-2">
                <div className="body-medium text-foreground text-sm">
                  {isToday ? 'Сьогодні' : day.day}
                </div>
                
                <div className="text-xs text-foreground-muted">
                  {new Date(day.date).toLocaleDateString('uk-UA', { month: 'short', day: 'numeric' })}
                </div>

                <div className="space-y-1">
                  <div className="text-lg font-bold text-foreground">
                    {day.tempMax}°
                  </div>
                  <div className="text-sm text-foreground-muted">
                    {day.tempMin}°
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 text-xs text-foreground-subtle">
                  <div className="flex flex-col items-center">
                    <span>🌬️</span>
                    <span>{day.windMax}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>☀️</span>
                    <span>{day.uvMax}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>🌧️</span>
                    <span>{day.precipMax}%</span>
                  </div>
                </div>

                <div className="border-t border-card-border pt-2 space-y-1">
                  <div className="text-xs text-foreground-muted">
                    Краще о {day.bestTime}
                  </div>
                  <div className={`text-xs font-medium ${comfort.color}`}>
                    {comfort.text}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-card-hover rounded-lg">
        <div className="text-xs text-foreground-muted body text-center">
          💡 Натисніть на день для детального прогнозу. Кольори показують комфортність умов для бігу.
        </div>
      </div>
    </div>
  );
}