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
    conditions: "Conditions",
    selectedTime: "Selected Time",
    now: "Now",
    inSelectedTime: "In selected time",
    
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
    adviceTemplate: (temp: number, top: string, bottom: string, extras: string[], spf: number, water: number, bestTime: string) =>
      `~${temp}°C. Wear ${top}, ${bottom}${extras.length ? ", " + extras.join(", ") : ""}; SPF ${spf}. Take ${water} ml of water. Best time: ${bestTime}.`,
    
    // Warnings
    highTemp: "High temperature — avoid direct sunlight",
    freezing: "Icing — be careful on the road", 
    strongWind: "Strong wind — may complicate running",
    highRain: "High rain risk — consider indoor route",
    highUV: "Very high UV — protection mandatory",
    
    // Error messages
    weatherLoadError: "Weather loading error",
    weeklyForecastLoadError: "Failed to load weekly forecast",
    noWeatherData: "No weather data",
    loadForecastError: "Failed to load forecast",
    
    // Weekly forecast
    weeklyForecast: "Weekly Forecast",
    weeklyForecastForRunning: "Weekly Running Forecast",
    today: "Today",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    difficult: "Difficult",
    bestAt: "Best at",
    clickDayForDetails: "💡 Click on a day for detailed forecast. Colors show comfort conditions for running.",
    
    // Clothing/outfit
    whatToWear: "What to Wear",
    top: "Top",
    bottom: "Bottom",
    footwearSocks: "Footwear and Socks",
    headwearGlasses: "Headwear and Glasses",
    accessories: "Accessories",
    additional: "Additional",
    
    // Sun protection
    sunProtection: "Sun Protection",
    
    // Hydration
    hydration: "Hydration",
    totalWaterAmount: "total water amount",
    before: "before",
    during: "during",
    after: "after",
    electrolytesRecommended: "⚡ Electrolytes recommended",
    
    // Safety
    warning: "Warning",
    
    // Best time
    bestTimeForRunning: "Best Time for Running",
    noWeatherDataForOptimal: "No weather data to calculate optimal time",
    rankBestTime: "#{rank} best time",
    showMoreTimes: "Show more times →",
    comfortBarExplanation: "💡 The blue-pink bars show running comfort levels based on temperature, humidity, wind, UV, and rain. Longer bars = better conditions.",
    
    // Hourly weather
    hourlyWeather: "Hourly Weather",
    clickForDetails: "Click for detailed forecast",
    rainAlert: "Rain!",
    selected: "Selected",
    detailsWillShow: "detailed forecast for this time will be shown above",
    showAllHours: "Show all {count} hours →",
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
    conditions: "Умови",
    selectedTime: "Вибраний час",
    now: "Зараз",
    inSelectedTime: "В обраний час",
    
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
    adviceTemplate: (temp: number, top: string, bottom: string, extras: string[], spf: number, water: number, bestTime: string) =>
      `~${temp}°C. Одягни ${top}, ${bottom}${extras.length ? ", " + extras.join(", ") : ""}; SPF ${spf}. Візьми ${water} мл води. Найкращий час: ${bestTime}.`,
    
    // Warnings
    highTemp: "Висока температура — уникай прямого сонця",
    freezing: "Обледеніння — будь обережним на дорозі",
    strongWind: "Сильний вітер — може ускладнити біг",
    highRain: "Високий ризик дощу — розглянь закритий маршрут",
    highUV: "Дуже високий UV — обов'язковий захист",
    
    // Error messages
    weatherLoadError: "Помилка завантаження погоди",
    weeklyForecastLoadError: "Помилка завантаження тижневого прогнозу",
    noWeatherData: "Немає даних про погоду",
    loadForecastError: "Не вдалося завантажити прогноз",
    
    // Weekly forecast
    weeklyForecast: "Тижневий прогноз",
    weeklyForecastForRunning: "Тижневий прогноз для бігу",
    today: "Сьогодні",
    excellent: "Відмінно",
    good: "Добре",
    fair: "Задовільно",
    difficult: "Складно",
    bestAt: "Краще о",
    clickDayForDetails: "💡 Натисніть на день для детального прогнозу. Кольори показують комфортність умов для бігу.",
    
    // Clothing/outfit
    whatToWear: "Що одягти",
    top: "Верх",
    bottom: "Низ",
    footwearSocks: "Взуття та шкарпетки",
    headwearGlasses: "Головні убори та окуляри",
    accessories: "Аксесуари",
    additional: "Додатково",
    
    // Sun protection
    sunProtection: "Захист від сонця",
    
    // Hydration
    hydration: "Гідратація",
    totalWaterAmount: "загальна кількість води",
    before: "до",
    during: "під час",
    after: "після",
    electrolytesRecommended: "⚡ Електроліти рекомендуються",
    
    // Safety
    warning: "Попередження",
    
    // Best time
    bestTimeForRunning: "Найкращий час для бігу",
    noWeatherDataForOptimal: "Немає даних про погоду для розрахунку оптимального часу",
    rankBestTime: "#{rank} найкращий час",
    showMoreTimes: "Показати більше часів →",
    comfortBarExplanation: "💡 Сині-рожеві смужки показують рівень комфорту для бігу на основі температури, вологості, вітру, УФ та дощу. Довші смужки = кращі умови.",
    
    // Hourly weather
    hourlyWeather: "Погода по годинах",
    clickForDetails: "Натисніть для детального прогнозу",
    rainAlert: "Дощ!",
    selected: "Вибрано",
    detailsWillShow: "детальний прогноз для цього часу буде показано вище",
    showAllHours: "Показати всі {count} годин →",
  }
} as const;

export function t(key: keyof typeof translations.EN, language: "EN" | "UA" = "UA"): string {
  return translations[language][key] as string;
}