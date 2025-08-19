export function getWindInterpretation(windSpeed: number, language: "EN" | "UA" = "UA"): string {
  const interpretations = {
    UA: {
      calm: "Штиль або легкий бриз — ідеальні умови для бігу. Вітер не вплине на ваш темп.",
      light: "Легкий вітер — комфортні умови. Може навіть допомогти охолоджувати під час бігу.",
      moderate: "Помірний вітер — може дещо ускладнити біг, особливо проти вітру. Плануйте маршрут з урахуванням напрямку.",
      strong: "Сильний вітер — значно ускладнить біг. Знизьте темп, будьте обережні з рівновагою. Розгляньте біг у захищеному місці.",
      extreme: "Дуже сильний вітер — небезпечно для бігу на відкритому просторі. Краще перенести тренування або бігти в залі."
    },
    EN: {
      calm: "Calm or light breeze — perfect running conditions. Wind won't affect your pace.",
      light: "Light wind — comfortable conditions. May even help cool you down during running.",
      moderate: "Moderate wind — may complicate running somewhat, especially against headwind. Plan route considering wind direction.",
      strong: "Strong wind — will significantly complicate running. Reduce pace, be careful with balance. Consider running in sheltered areas.",
      extreme: "Very strong wind — dangerous for open-space running. Better postpone workout or run indoors."
    }
  };

  const messages = interpretations[language];

  if (windSpeed <= 5) return messages.calm;
  if (windSpeed <= 15) return messages.light;
  if (windSpeed <= 25) return messages.moderate;
  if (windSpeed <= 35) return messages.strong;
  return messages.extreme;
}

export function getHumidityInterpretation(humidity: number, temperature: number, language: "EN" | "UA" = "UA"): string {
  const interpretations = {
    UA: {
      veryDry: "Дуже сухе повітря — зволожуйте дихальні шляхи, пийте достатньо води. Можлива швидша втрата вологи.",
      dry: "Сухе повітря — комфортні умови для бігу. Піт випаровується ефективно, охолоджуючи тіло.",
      comfortable: "Оптимальна вологість — ідеальні умови для бігу. Тіло ефективно регулює температуру.",
      humid: "Підвищена вологість — піт випаровується повільніше. Знизьте темп, пийте більше води.",
      veryHumid: "Висока вологість — значно ускладнює охолодження тіла. Часті перерви, багато води, обережно з перегрівом.",
      extreme: "Критична вологість — дуже небезпечно для інтенсивного бігу. Розгляньте легке тренування або перенесіть на інший час."
    },
    EN: {
      veryDry: "Very dry air — moisturize airways, drink enough water. Possible faster moisture loss.",
      dry: "Dry air — comfortable running conditions. Sweat evaporates efficiently, cooling the body.",
      comfortable: "Optimal humidity — perfect running conditions. Body efficiently regulates temperature.",
      humid: "Increased humidity — sweat evaporates slower. Reduce pace, drink more water.",
      veryHumid: "High humidity — significantly complicates body cooling. Frequent breaks, lots of water, careful with overheating.",
      extreme: "Critical humidity — very dangerous for intense running. Consider light workout or postpone."
    }
  };

  const messages = interpretations[language];

  // Adjust thresholds based on temperature
  let dryThreshold = 40;
  let comfortableThreshold = 60;
  let humidThreshold = 75;
  let veryHumidThreshold = 85;

  if (temperature >= 25) {
    // Hot weather - lower humidity becomes problematic sooner
    comfortableThreshold = 50;
    humidThreshold = 65;
    veryHumidThreshold = 80;
  } else if (temperature <= 10) {
    // Cold weather - higher humidity is more tolerable
    comfortableThreshold = 70;
    humidThreshold = 85;
  }

  if (humidity <= 30) return messages.veryDry;
  if (humidity <= dryThreshold) return messages.dry;
  if (humidity <= comfortableThreshold) return messages.comfortable;
  if (humidity <= humidThreshold) return messages.humid;
  if (humidity <= veryHumidThreshold) return messages.veryHumid;
  return messages.extreme;
}

export function getFeelsLikeInterpretation(actualTemp: number, feelsLike: number, language: "EN" | "UA" = "UA"): string {
  const diff = Math.abs(feelsLike - actualTemp);
  const isWarmer = feelsLike > actualTemp;
  
  const interpretations = {
    UA: {
      minimal: `Відчувається як ${Math.round(feelsLike)}°C — практично як фактична температура.`,
      slight: `Відчувається ${isWarmer ? 'тепліше' : 'холодніше'} (${Math.round(feelsLike)}°C) через ${isWarmer ? 'вологість та безвітря' : 'вітер'}.`,
      moderate: `Значно відчувається ${isWarmer ? 'тепліше' : 'холодніше'} (${Math.round(feelsLike)}°C) — ${isWarmer ? 'одягайтеся легше, пийте більше' : 'одягайтеся тепліше'}.`,
      extreme: `Критична різниця! Відчувається як ${Math.round(feelsLike)}°C — ${isWarmer ? 'ризик перегріву, скоротіть дистанцію' : 'ризик переохолодження, захист обов\'язковий'}.`
    },
    EN: {
      minimal: `Feels like ${Math.round(feelsLike)}°C — practically same as actual temperature.`,
      slight: `Feels ${isWarmer ? 'warmer' : 'cooler'} (${Math.round(feelsLike)}°C) due to ${isWarmer ? 'humidity and low wind' : 'wind chill'}.`,
      moderate: `Significantly feels ${isWarmer ? 'warmer' : 'cooler'} (${Math.round(feelsLike)}°C) — ${isWarmer ? 'dress lighter, drink more' : 'dress warmer'}.`,
      extreme: `Critical difference! Feels like ${Math.round(feelsLike)}°C — ${isWarmer ? 'overheating risk, reduce distance' : 'hypothermia risk, protection mandatory'}.`
    }
  };

  const messages = interpretations[language];

  if (diff <= 2) return messages.minimal;
  if (diff <= 5) return messages.slight;
  if (diff <= 10) return messages.moderate;
  return messages.extreme;
}