"use client";

import { useState, useEffect } from "react";

export interface Preferences {
  duration: number;
  gender: "male" | "female" | "prefer_not_to_say";
  intensity: "light" | "moderate" | "intense";
  allowDark: boolean;
  units: "metric" | "imperial";
  language: "EN" | "UA";
  timeWindow: "auto" | "morning" | "day" | "evening";
  preferredTime: "any" | "morning" | "day" | "evening";
}

const defaultPreferences: Preferences = {
  duration: 45,
  gender: "prefer_not_to_say",
  intensity: "moderate",
  allowDark: false,
  units: "metric",
  language: "EN",
  timeWindow: "auto",
  preferredTime: "any",
};

const PREFERENCES_KEY = "runready-preferences";

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch (error) {
      console.warn("Failed to load preferences:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updatePreferences = (updates: Partial<Preferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPreferences));
    } catch (error) {
      console.warn("Failed to save preferences:", error);
    }
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    try {
      localStorage.removeItem(PREFERENCES_KEY);
    } catch (error) {
      console.warn("Failed to clear preferences:", error);
    }
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    isLoaded,
  };
}