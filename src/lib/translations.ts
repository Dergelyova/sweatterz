export const translations = {
  EN: {
    // Header
    appDescription: "Smart running weather advice",
    
    // Quick advice card
    quickAdvice: "Quick Advice",
    loading: "Loading forecast...",
    updatedJustNow: "Updated just now",
    refreshForecast: "Refresh forecast",
    currentConditions: "Current Conditions",
    
    // Controls
    settings: "Settings",
    duration: "Workout Duration",
    intensity: "Intensity",
    gender: "Gender",
    preferredTime: "Preferred Time",
    allowDarkTime: "Allow dark hours",
    
    // Gender options
    male: "male",
    female: "female",
    preferNotToSay: "prefer not to say",
    
    // Intensity options
    lightWorkout: "light workout",
    moderateWorkout: "moderate workout",
    intenseWorkout: "intense workout",
    
    // Time options
    anyTime: "any time",
    morning: "morning (6-10)",
    day: "day (10-18)",
    evening: "evening (18-22)",
    
    // Location
    location: "Location",
    changeLocation: "Change Location",
    searchPlaceholder: "Enter city name...",
    currentLocation: "📍 My current location",
    loadingLocation: "Getting location...",
    locationError: "Couldn't get location",
    
    // Weather badges
    temp: "Temp",
    feelsLike: "Feels like",
    humidity: "Humidity",
    wind: "Wind",
    uvIndex: "UV Index",
    rain: "Rain",
    
    // Time formatting
    minutes: "min",
    hours: "hrs",
    
    // Quick advice template
    todayTemplate: (temp: number, top: string, bottom: string, extras: string[], spf: number, water: number, bestTime: string) =>
      `Today ~${temp}°C. Wear ${top}, ${bottom}${extras.length ? ", " + extras.join(", ") : ""}; SPF ${spf}. Take ${water} ml of water. Best time: ${bestTime}.`,
    
    // Warnings
    highTemp: "High temperature — avoid direct sunlight",
    freezing: "Icing — be careful on the road", 
    strongWind: "Strong wind — may complicate running",
    highRain: "High rain risk — consider indoor route",
    highUV: "Very high UV — protection mandatory",
  },
  
  UA: {
    // Header
    appDescription: "Smart running weather advice",
    
    // Quick advice card
    quickAdvice: "Швидкий висновок",
    loading: "Завантажую прогноз...",
    updatedJustNow: "Оновлено щойно",
    refreshForecast: "Оновити прогноз",
    currentConditions: "Поточні умови",
    
    // Controls
    settings: "Налаштування",
    duration: "Тривалість тренування",
    intensity: "Інтенсивність",
    gender: "Стать",
    preferredTime: "Бажаний час",
    allowDarkTime: "Дозволяти темну пору",
    
    // Gender options
    male: "чоловік",
    female: "жінка",
    preferNotToSay: "не вказувати",
    
    // Intensity options
    lightWorkout: "легке тренування",
    moderateWorkout: "помірне тренування",
    intenseWorkout: "інтенсивне тренування",
    
    // Time options
    anyTime: "будь-який час",
    morning: "ранок (6-10)",
    day: "день (10-18)",
    evening: "вечір (18-22)",
    
    // Location
    location: "Локація",
    changeLocation: "Змінити локацію",
    searchPlaceholder: "Введіть назву міста...",
    currentLocation: "📍 Моя поточна локація",
    loadingLocation: "Отримую локацію...",
    locationError: "Не вдалося отримати локацію",
    
    // Weather badges
    temp: "Temp",
    feelsLike: "Feels like",
    humidity: "Humidity",
    wind: "Wind",
    uvIndex: "UV Index",
    rain: "Rain",
    
    // Time formatting
    minutes: "хв",
    hours: "год",
    
    // Quick advice template
    todayTemplate: (temp: number, top: string, bottom: string, extras: string[], spf: number, water: number, bestTime: string) =>
      `Сьогодні ~${temp}°C. Одягни ${top}, ${bottom}${extras.length ? ", " + extras.join(", ") : ""}; SPF ${spf}. Візьми ${water} мл води. Найкращий час: ${bestTime}.`,
    
    // Warnings
    highTemp: "Висока температура — уникай прямого сонця",
    freezing: "Обледеніння — будь обережним на дорозі",
    strongWind: "Сильний вітер — може ускладнити біг",
    highRain: "Високий ризик дощу — розглянь закритий маршрут",
    highUV: "Дуже високий UV — обов'язковий захист",
  }
} as const;

export function t(key: keyof typeof translations.EN, language: "EN" | "UA" = "UA"): string {
  return translations[language][key] as string;
}