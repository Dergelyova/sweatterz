"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  type ForecastResponse,
  type HourPoint,
  comfortScore,
  bestHourSlots,
  outfitAdvice,
  spfAdvice,
  waterAdvice,
  fmtHH,
} from "@/lib/weather-utils";
import { Header } from "./header";
import { QuickAdviceCard } from "./quick-advice-card";
import { ControlsSection } from "./controls-section";
import { WearCard, SPFCard, HydrationCard, SafetyWarning } from "./detail-cards";
import { BestTimeCard } from "./best-time";
import { HourlyTiles } from "./hourly-tiles";
import { WeeklyForecast } from "./weekly-forecast";
import { LocationDisplay } from "./location-display";
import { usePreferences } from "@/hooks/use-preferences";
import { t, translations } from "@/lib/translations";

export function WeatherClient() {
  const { preferences, updatePreferences, isLoaded } = usePreferences();
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [hours, setHours] = useState<HourPoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<HourPoint | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dailyHours, setDailyHours] = useState<Record<string, HourPoint[]>>({});

  useEffect(() => {
    const fallbackKyiv = { lat: 50.4501, lon: 30.5234 };
    if (!navigator.geolocation) {
      setCoords(fallbackKyiv);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setCoords(fallbackKyiv)
    );
  }, []);

  const fetchWeatherData = async (targetDate?: string) => {
    if (!coords) return;
    setLoading(true);
    setError(null);
    
    try {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.searchParams.set("latitude", String(coords.lat));
      url.searchParams.set("longitude", String(coords.lon));
      url.searchParams.set(
        "hourly",
        [
          "temperature_2m",
          "apparent_temperature",
          "relative_humidity_2m", 
          "precipitation_probability",
          "uv_index",
          "wind_speed_10m",
        ].join(",")
      );
      url.searchParams.set("forecast_days", "7"); // Get full week
      url.searchParams.set("timezone", "auto");
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Weather request failed");
      
      const data: ForecastResponse = await res.json();
      const h = data.hourly;
      const points: HourPoint[] = h.time.map((time, i) => {
        const t = h.temperature_2m[i];
        const feelsLike = h.apparent_temperature[i];
        const rh = h.relative_humidity_2m[i];
        const uv = h.uv_index[i];
        const wind = h.wind_speed_10m[i];
        const precip = h.precipitation_probability[i];
        return {
          time,
          t,
          feelsLike,
          rh,
          uv,
          wind,
          precip,
          score: comfortScore(t, rh, wind, uv, precip),
        };
      });
      
      // Group hours by date
      const hoursByDate: Record<string, HourPoint[]> = {};
      points.forEach(point => {
        const date = point.time.split('T')[0];
        if (!hoursByDate[date]) {
          hoursByDate[date] = [];
        }
        hoursByDate[date].push(point);
      });
      
      setDailyHours(hoursByDate);
      
      // Set hours for the selected date (default to today if targeting specific date)
      const dateToUse = targetDate || selectedDate;
      const todayStr = new Date().toISOString().split('T')[0];
      const now = Date.now();
      
      if (dateToUse === todayStr) {
        // For today, filter out past hours
        const todayHours = hoursByDate[dateToUse] || [];
        const future = todayHours.filter((p) => new Date(p.time).getTime() >= now);
        setHours(future);
      } else {
        // For other days, show all hours
        setHours(hoursByDate[dateToUse] || []);
      }
      
      setLastUpdated(new Date());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("weatherLoadError", preferences.language));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [coords]);

  // Handle day selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedHour(null); // Reset selected hour when changing days
    
    const todayStr = new Date().toISOString().split('T')[0];
    const now = Date.now();
    
    if (date === todayStr) {
      // For today, filter out past hours
      const todayHours = dailyHours[date] || [];
      const future = todayHours.filter((p) => new Date(p.time).getTime() >= now);
      setHours(future);
    } else {
      // For other days, show all hours
      setHours(dailyHours[date] || []);
    }
  };

  const currentHour = selectedHour || hours?.[0] || null;
  const best = useMemo(
    () => hours ? bestHourSlots(hours, preferences.allowDark, preferences.preferredTime) : [],
    [hours, preferences.allowDark, preferences.preferredTime]
  );

  const outfit = useMemo(() => {
    if (!currentHour) return null;
    return outfitAdvice(
      currentHour.t, 
      currentHour.wind, 
      currentHour.rh, 
      currentHour.uv,
      "neutral", // Default neutral preference since we removed the setting
      preferences.gender, 
      preferences.intensity
    );
  }, [currentHour, preferences.gender, preferences.intensity]);

  const spf = useMemo(() => {
    if (!currentHour) return null;
    return spfAdvice(currentHour.uv);
  }, [currentHour]);

  const water = useMemo(() => {
    if (!currentHour) return null;
    return waterAdvice(preferences.duration, currentHour.t, currentHour.rh, preferences.intensity);
  }, [currentHour, preferences.duration, preferences.intensity]);

  const quick = useMemo(() => {
    if (!currentHour || !outfit || !spf || !water) return null;
    const orText = preferences.language === "EN" ? " or " : " або ";
    const bestStr = best.map((b) => fmtHH(b.time)).slice(0, 2).join(orText);
    return translations[preferences.language].adviceTemplate(
      Math.round(currentHour.t),
      outfit.top,
      outfit.bottom,
      outfit.extras,
      spf.spf,
      water.ml,
      bestStr
    );
  }, [currentHour, outfit, spf, water, best, preferences.language]);

  const warnings = useMemo(() => {
    if (!currentHour) return [];
    const warns: string[] = [];
    
    if (currentHour.t >= 30) warns.push(t("highTemp", preferences.language));
    if (currentHour.t <= 0) warns.push(t("freezing", preferences.language));
    if (currentHour.wind >= 25) warns.push(t("strongWind", preferences.language));
    if (currentHour.precip >= 70) warns.push(t("highRain", preferences.language));
    if (currentHour.uv >= 8) warns.push(t("highUV", preferences.language));
    
    return warns;
  }, [currentHour, preferences.language]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header
        currentLang={preferences.language}
        onLanguageChange={(lang) => updatePreferences({ language: lang as "EN" | "UA" })}
      />

      <div className="space-y-6">
        <QuickAdviceCard
          loading={loading}
          error={error}
          quick={quick}
          current={currentHour}
          lastUpdated={lastUpdated}
          onRefresh={fetchWeatherData}
          selectedDate={selectedDate}
          selectedHour={selectedHour}
          language={preferences.language}
        />

        <div className="grid grid-cols-1 gap-4">
          <LocationDisplay
            coords={coords}
            onLocationChange={(newCoords) => {
              setCoords(newCoords);
              setSelectedDate(new Date().toISOString().split('T')[0]); // Reset to today when location changes
            }}
            language={preferences.language}
          />
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="heading text-lg text-foreground mb-4">{t("settings", preferences.language)}</h3>
          <ControlsSection
            duration={preferences.duration}
            setDuration={(duration) => updatePreferences({ duration })}
            gender={preferences.gender}
            setGender={(gender) => updatePreferences({ gender })}
            intensity={preferences.intensity}
            setIntensity={(intensity) => updatePreferences({ intensity })}
            allowDark={preferences.allowDark}
            setAllowDark={(allowDark) => updatePreferences({ allowDark })}
            preferredTime={preferences.preferredTime}
            setPreferredTime={(preferredTime) => updatePreferences({ preferredTime })}
            language={preferences.language}
          />
        </div>

        {warnings.length > 0 && <SafetyWarning warnings={warnings} language={preferences.language} />}

        {!loading && !error && hours && (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                {outfit && <WearCard outfit={outfit} language={preferences.language} />}
                {spf && <SPFCard spf={spf} language={preferences.language} />}
              </div>
              
              <div className="space-y-6">
                {water && <HydrationCard water={water} language={preferences.language} />}
                <BestTimeCard best={best} language={preferences.language} />
              </div>
            </div>

            <HourlyTiles 
              hours={hours} 
              onHourSelect={setSelectedHour}
              maxTiles={16}
              language={preferences.language}
            />

            <WeeklyForecast
              coords={coords}
              preferredTime={preferences.preferredTime}
              allowDark={preferences.allowDark}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              language={preferences.language}
            />
          </>
        )}
      </div>
    </>
  );
}