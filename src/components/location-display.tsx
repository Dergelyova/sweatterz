"use client";

import { useState, useEffect } from "react";

interface LocationDisplayProps {
  coords: { lat: number; lon: number } | null;
  onLocationChange: (coords: { lat: number; lon: number }) => void;
}

export function LocationDisplay({ coords, onLocationChange }: LocationDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [displayLocation, setDisplayLocation] = useState("Завантаження...");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Get location name from coordinates using reverse geocoding
  const getLocationName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=en`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        const city = address.city || address.town || address.village || address.suburb || address.hamlet;
        const state = address.state || address.province || address.region;
        const country = address.country;
        
        let locationText = "";
        
        if (city && country) {
          locationText = state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;
        } else if (country) {
          locationText = `${state || 'Unknown'}, ${country}`;
        } else {
          locationText = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
        }
        
        return locationText;
      }
      
      return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    }
  };

  // Update display location when coords change
  useEffect(() => {
    if (coords) {
      getLocationName(coords.lat, coords.lon).then(setDisplayLocation);
    }
  }, [coords]);

  // Search for locations
  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      // Using OpenStreetMap Nominatim for geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error("Location search failed:", error);
      setSearchResults([]);
    }
    setLoading(false);
  };

  const handleLocationSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    
    // Set display location immediately from search result
    const address = result.address || {};
    const city = address.city || address.town || address.village || result.name;
    const state = address.state || address.province || address.region;
    const country = address.country;
    
    let locationText = result.display_name;
    if (city && country) {
      locationText = state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;
    }
    
    setDisplayLocation(locationText);
    onLocationChange({ lat, lon });
    setIsEditing(false);
    setSearchResults([]);
    setLocationName("");
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;
    
    setLoading(true);
    setDisplayLocation("Отримую локацію...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        
        // Get location name immediately
        const locationText = await getLocationName(coords.lat, coords.lon);
        setDisplayLocation(locationText);
        onLocationChange(coords);
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation failed:", error);
        setDisplayLocation("Не вдалося отримати локацію");
        setLoading(false);
      }
    );
  };

  if (isEditing) {
    return (
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="body-medium text-foreground">Змінити локацію</h4>
          <button
            onClick={() => setIsEditing(false)}
            className="text-foreground-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Введіть назву міста..."
            value={locationName}
            onChange={(e) => {
              setLocationName(e.target.value);
              searchLocations(e.target.value);
            }}
            className="w-full px-3 py-2 bg-card border border-card-border rounded-lg text-foreground focus-gradient"
            autoFocus
          />
          
          {loading && (
            <div className="text-center py-2">
              <div className="w-4 h-4 border-2 border-blue border-t-transparent rounded-full animate-spin inline-block" />
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {searchResults.map((result, index) => {
                const address = result.address || {};
                const city = address.city || address.town || address.village || result.name;
                const state = address.state || address.province || address.region;
                const country = address.country;
                
                let shortName = result.display_name;
                if (city && country) {
                  shortName = state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(result)}
                    className="w-full text-left p-2 hover:bg-card-hover rounded text-sm body transition-colors duration-150"
                  >
                    <div className="text-foreground font-medium">{shortName}</div>
                    {shortName !== result.display_name && (
                      <div className="text-foreground-subtle text-xs truncate">{result.display_name}</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-card-border">
          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="text-sm text-blue hover:text-pink transition-colors duration-150 body-medium"
          >
            📍 Моя поточна локація
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="glass rounded-xl p-3 hover-lift w-full text-left group transition-all duration-150"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-foreground-muted body uppercase tracking-wide">
            Локація
          </div>
          <div className="text-sm body-medium text-foreground group-hover:text-blue transition-colors duration-150">
            {displayLocation}
          </div>
        </div>
        <div className="text-foreground-muted group-hover:text-foreground transition-colors duration-150">
          ✏️
        </div>
      </div>
    </button>
  );
}