import { WeatherData } from '../types';

export async function fetchOpenWeatherData(apiKey?: string, lat = 4.3995, lon = 113.9914): Promise<WeatherData> {
  const keyToUse = apiKey || (import.meta as any).env?.VITE_OPENWEATHER_API_KEY;

  if (keyToUse) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${keyToUse}&units=metric`
      );
      if (response.ok) {
        const data = await response.json();
        // Convert wind speed m/s to knots: 1 m/s = 1.94384 knots
        const windKnots = Math.round(data.wind.speed * 1.94384);
        // Estimate sea wave height based on wind speed (approx Beaufort scale estimate)
        const seaMeters = Number((0.2 + (windKnots * 0.08)).toFixed(1));

        return {
          temperatureC: Number(data.main.temp.toFixed(1)),
          windSpeedKt: windKnots,
          windDirection: getCardinalDirection(data.wind.deg || 0),
          seaStateM: seaMeters,
          conditions: data.weather[0]?.description ? capitalize(data.weather[0].description) : 'Clear Sky',
          pressureHpa: data.main.pressure,
          humidityPct: data.main.humidity,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLiveApi: true,
          locationName: `${data.name || 'Miri Coast'} Offshore`
        };
      }
    } catch (e) {
      console.warn('OpenWeather API call error, falling back to simulated live feed:', e);
    }
  }

  // Fallback realistic live simulation for Salbiah Field / Baram Cluster
  const windVariation = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
  const simulatedWind = Math.max(8, Math.min(25, 12 + windVariation));
  const seaVal = Number((0.8 + (simulatedWind * 0.033)).toFixed(1));

  return {
    temperatureC: 29.5,
    windSpeedKt: simulatedWind,
    windDirection: 'ENE',
    seaStateM: seaVal,
    conditions: simulatedWind > 18 ? 'Squally / Moderate Waves' : 'Wind 12 kt | Sea 1.2 m',
    pressureHpa: 1011,
    humidityPct: 78,
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isLiveApi: false,
    locationName: 'Salbiah Field (Miri Offshore)'
  };
}

function getCardinalDirection(angle: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(angle / 22.5) % 16];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
