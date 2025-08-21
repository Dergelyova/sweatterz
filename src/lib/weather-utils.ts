export interface HourlyPayload {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  uv_index: number[];
  wind_speed_10m: number[];
}

export interface ForecastResponse {
  timezone: string;
  hourly: HourlyPayload;
}

export interface HourPoint {
  time: string;
  t: number;
  feelsLike: number;
  rh: number;
  uv: number;
  wind: number;
  precip: number;
  score: number;
}

export const fmtHH = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export function comfortScore(
  t: number,
  rh: number,
  wind: number,
  uv: number,
  precipProb: number
) {
  const tempPenalty = Math.abs(t - 12) * 1.2;
  const humidityPenalty = clamp((rh - 50) / 5, 0, 6);
  const windPenalty = Math.max(0, (wind - 12) / 5);
  const uvPenalty = uv >= 6 ? 4 : uv >= 3 ? 1.5 : 0;
  const rainPenalty =
    precipProb >= 60 ? 6 : precipProb >= 30 ? 2.5 : 0.2 * (precipProb / 10);
  return tempPenalty + humidityPenalty + windPenalty + uvPenalty + rainPenalty;
}

export interface RunningCondition {
  level: "excellent" | "good" | "fair" | "poor";
  icon: string;
  borderColor: string;
  explanation: string;
  factors: string[];
}

export function getRunningCondition(
  hour: HourPoint,
  language: "EN" | "UA" = "UA"
): RunningCondition {
  const { t, rh, wind, uv, precip, score } = hour;
  
  const factors: string[] = [];
  const isEN = language === "EN";
  
  // Analyze each factor
  if (t >= 8 && t <= 18) {
    factors.push(isEN ? "✅ Ideal temperature" : "✅ Ідеальна температура");
  } else if (t < 0) {
    factors.push(isEN ? "❄️ Very cold" : "❄️ Дуже холодно");
  } else if (t > 25) {
    factors.push(isEN ? "🔥 Hot" : "🔥 Жарко");
  } else {
    factors.push(isEN ? "🌡️ Acceptable temperature" : "🌡️ Прийнятна температура");
  }
  
  if (rh <= 60) {
    factors.push(isEN ? "💨 Good humidity" : "💨 Хороша вологість");
  } else if (rh > 80) {
    factors.push(isEN ? "💧 Very humid" : "💧 Дуже волого");
  } else {
    factors.push(isEN ? "💧 Moderate humidity" : "💧 Помірна вологість");
  }
  
  if (wind <= 10) {
    factors.push(isEN ? "🍃 Light wind" : "🍃 Легкий вітер");
  } else if (wind > 20) {
    factors.push(isEN ? "💨 Strong wind" : "💨 Сильний вітер");
  } else {
    factors.push(isEN ? "🌬️ Moderate wind" : "🌬️ Помірний вітер");
  }
  
  if (uv <= 2) {
    factors.push(isEN ? "☁️ Low UV" : "☁️ Низький УФ");
  } else if (uv >= 7) {
    factors.push(isEN ? "☀️ High UV - protection needed" : "☀️ Високий УФ - потрібен захист");
  } else {
    factors.push(isEN ? "🌤️ Moderate UV" : "🌤️ Помірний УФ");
  }
  
  if (precip <= 10) {
    factors.push(isEN ? "☀️ No rain" : "☀️ Без дощу");
  } else if (precip >= 60) {
    factors.push(isEN ? "🌧️ High rain risk" : "🌧️ Високий ризик дощу");
  } else {
    factors.push(isEN ? "🌦️ Some rain possible" : "🌦️ Можливий дощ");
  }
  
  // Determine overall condition based on score
  if (score <= 8) {
    return {
      level: "excellent",
      icon: "🏃‍♂️",
      borderColor: "border-green-400",
      explanation: isEN ? "Excellent conditions for running!" : "Відмінні умови для бігу!",
      factors
    };
  } else if (score <= 15) {
    return {
      level: "good", 
      icon: "👍",
      borderColor: "border-blue",
      explanation: isEN ? "Good running conditions" : "Хороші умови для бігу",
      factors
    };
  } else if (score <= 25) {
    return {
      level: "fair",
      icon: "⚠️",
      borderColor: "border-yellow-400",
      explanation: isEN ? "Fair conditions - some challenges" : "Задовільні умови - є виклики",
      factors
    };
  } else {
    return {
      level: "poor",
      icon: "❌", 
      borderColor: "border-red-400",
      explanation: isEN ? "Challenging conditions for running" : "Складні умови для бігу",
      factors
    };
  }
}

export interface DetailedOutfit {
  top: string;
  bottom: string;
  headwear: string[];
  footwear: string[];
  accessories: string[];
  extras: string[];
}

export function outfitAdvice(
  t: number,
  wind: number,
  rh: number,
  uv: number,
  preference: "neutral" | "runs_hot" | "runs_cold",
  gender: "male" | "female" | "prefer_not_to_say" = "prefer_not_to_say",
  intensity: "light" | "moderate" | "intense" = "moderate"
): DetailedOutfit {
  let temp = t;
  if (preference === "runs_hot") temp += 2;
  if (preference === "runs_cold") temp -= 2;

  // Adjust for intensity
  if (intensity === "intense") temp += 3;
  else if (intensity === "light") temp -= 1;

  // Top recommendations
  let top = "";
  if (temp >= 25) {
    top = gender === "female" ? "спортивний топ або ультралегка майка" : "майка без рукавів або ультралегка футболка";
  } else if (temp >= 20) {
    top = "легка дихаюча футболка";
  } else if (temp >= 12) {
    top = "футболка з коротким рукавом";
  } else if (temp >= 6) {
    top = "лонгслів або легкий термошар";
  } else if (temp >= 0) {
    top = "теплий лонгслів + легка вітровка";
  } else {
    top = "термошар + утеплена куртка";
  }

  // Bottom recommendations
  let bottom = "";
  if (temp >= 15) {
    bottom = gender === "female" ? "короткі шорти або легінси" : "бігові шорти";
  } else if (temp >= 8) {
    bottom = "шорти або капрі";
  } else if (temp >= 0) {
    bottom = "легінси або бігові тайти";
  } else {
    bottom = "теплі тайти або бігові штани";
  }

  // Headwear
  const headwear: string[] = [];
  if (uv >= 6) headwear.push("кепка з козирком");
  else if (uv >= 3) headwear.push("легка кепка");
  
  if (temp <= 4) headwear.push("тонка шапка або пов'язка");
  else if (temp <= 0) headwear.push("тепла шапка");

  if (uv >= 3) headwear.push("сонцезахисні окуляри");

  // Footwear
  const footwear: string[] = [];
  if (temp <= 0) {
    footwear.push("кросівки з протиковзною підошвою");
    footwear.push("теплі спортивні шкарпетки");
  } else if (temp <= 10) {
    footwear.push("бігові кросівки");
    footwear.push("середньої товщини шкарпетки");
  } else {
    footwear.push("легкі бігові кросівки");
    footwear.push("тонкі спортивні шкарпетки");
  }

  // Accessories
  const accessories: string[] = [];
  if (temp <= 4) accessories.push("легкі рукавички");
  if (rh >= 80 || temp >= 20) accessories.push("рушничок або пов'язка на зап'ястя");
  if (intensity === "intense" && temp >= 15) accessories.push("поясна сумка для води");

  // Extra conditions
  const extras: string[] = [];
  if (wind >= 20 && temp < 16) extras.push("вітрозахисна жилетка");
  if (rh >= 85 && temp >= 18) extras.push("додаткова футболка для зміни");
  if (temp <= -5) extras.push("балаклава або шарф");
  if (intensity === "intense") extras.push("спортивний годинник для моніторингу");

  return { top, bottom, headwear, footwear, accessories, extras };
}

export function spfAdvice(uv: number) {
  if (uv >= 8)
    return {
      spf: 50,
      note: "високий UV — SPF 50, оновлюй кожні 2 год, кепка й окуляри обов'язково",
    };
  if (uv >= 3)
    return { spf: 30, note: "помірний UV — SPF 30 + кепка/окуляри бажано" };
  return {
    spf: 15,
    note: "низький UV — SPF 15 достатньо; якщо біг ввечері, можна мінімально",
  };
}

export function waterAdvice(
  durationMin: number, 
  t: number, 
  rh: number,
  intensity: "light" | "moderate" | "intense" = "moderate"
) {
  let per30 = 300; // base ml per 30 minutes
  
  // Temperature and humidity adjustments
  if (t >= 20 || rh >= 70) per30 = 450;
  if (t >= 26 || rh >= 85) per30 = 600;
  if (t >= 30) per30 = 750;
  
  // Intensity adjustments
  if (intensity === "light") per30 *= 0.8;
  else if (intensity === "intense") per30 *= 1.3;
  
  const total = Math.ceil(((durationMin / 30) * per30) / 50) * 50;
  const electrolyte = t >= 24 || rh >= 80 || intensity === "intense" || durationMin >= 90;
  
  // Additional recommendations
  const beforeWorkout = Math.round(total * 0.2);
  const duringWorkout = Math.round(total * 0.6);
  const afterWorkout = Math.round(total * 0.2);
  
  return { 
    ml: total, 
    electrolyte,
    beforeWorkout,
    duringWorkout,
    afterWorkout,
    recommendation: getHydrationRecommendation(intensity, durationMin, t)
  };
}

function getHydrationRecommendation(
  intensity: "light" | "moderate" | "intense",
  duration: number,
  temperature: number
): string {
  if (intensity === "intense" || duration >= 90 || temperature >= 30) {
    return "Пийте невеликими ковтками кожні 10-15 хвилин";
  } else if (intensity === "moderate" || duration >= 45) {
    return "Пийте кожні 15-20 хвилин під час бігу";
  } else {
    return "Достатньо пити до та після тренування";
  }
}

export function bestHourSlots(
  hours: HourPoint[], 
  allowDark: boolean,
  preferredTime: "any" | "morning" | "day" | "evening" = "any"
) {
  let domain = hours.filter((h) => {
    const hr = new Date(h.time).getHours();
    
    // Filter by daylight if needed
    if (!allowDark && (hr < 6 || hr > 20)) return false;
    
    // Filter by preferred time
    if (preferredTime === "morning" && (hr < 6 || hr > 10)) return false;
    if (preferredTime === "day" && (hr < 10 || hr > 18)) return false;
    if (preferredTime === "evening" && (hr < 18 || hr > 22)) return false;
    
    return true;
  });
  
  // If no hours match criteria, fall back to allowing all hours
  if (domain.length === 0) {
    domain = hours.filter((h) => {
      const hr = new Date(h.time).getHours();
      if (!allowDark) return hr >= 6 && hr <= 20;
      return true;
    });
  }
  
  const pool = domain.length ? domain : hours;
  
  // Add bonus/penalty based on preferred time
  const scoredHours = pool.map(h => {
    const hr = new Date(h.time).getHours();
    let adjustedScore = h.score;
    
    // Bonus for preferred time slots
    if (preferredTime === "morning" && hr >= 6 && hr <= 10) adjustedScore -= 1;
    if (preferredTime === "day" && hr >= 10 && hr <= 18) adjustedScore -= 1;
    if (preferredTime === "evening" && hr >= 18 && hr <= 22) adjustedScore -= 1;
    
    return { ...h, score: adjustedScore };
  });
  
  return [...scoredHours].sort((a, b) => a.score - b.score).slice(0, 3);
}