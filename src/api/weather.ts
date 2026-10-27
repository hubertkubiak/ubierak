import type { Weather } from '../logic/types'

interface ForecastResponse {
  current: {
    temperature_2m: number
    apparent_temperature: number
    precipitation: number
    rain: number
    snowfall: number
    weather_code: number
    wind_speed_10m: number
    uv_index: number
    is_day: number
  }
  hourly: {
    temperature_2m: number[]
    precipitation_probability: (number | null)[]
  }
}

export async function fetchWeather(lat: number, lon: number, signal?: AbortSignal): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      'temperature_2m,apparent_temperature,precipitation,rain,snowfall,weather_code,wind_speed_10m,uv_index,is_day',
    hourly: 'temperature_2m,precipitation_probability',
    forecast_hours: '12',
    timezone: 'auto',
  })
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal })
  if (!res.ok) throw new Error(`Open-Meteo: ${res.status}`)
  const data: ForecastResponse = await res.json()
  const c = data.current
  const temps = data.hourly.temperature_2m.concat(c.temperature_2m)
  const probs = data.hourly.precipitation_probability.map((p) => p ?? 0)
  return {
    temperature: c.temperature_2m,
    apparent: c.apparent_temperature,
    precipitation: c.precipitation,
    rain: c.rain,
    snowfall: c.snowfall,
    weatherCode: c.weather_code,
    windSpeed: c.wind_speed_10m,
    uvIndex: c.uv_index,
    isDay: c.is_day === 1,
    minTemp: Math.min(...temps),
    maxTemp: Math.max(...temps),
    maxPrecipProb: Math.max(0, ...probs),
  }
}

/** WMO weather codes → Polish description + emoji. */
export function describeWeatherCode(code: number, isDay: boolean): { label: string; emoji: string } {
  if (code === 0) return { label: 'Bezchmurnie', emoji: isDay ? '☀️' : '🌙' }
  if (code <= 2) return { label: 'Częściowe zachmurzenie', emoji: isDay ? '🌤️' : '☁️' }
  if (code === 3) return { label: 'Pochmurno', emoji: '☁️' }
  if (code === 45 || code === 48) return { label: 'Mgła', emoji: '🌫️' }
  if (code >= 51 && code <= 57) return { label: 'Mżawka', emoji: '🌦️' }
  if (code >= 61 && code <= 67) return { label: 'Deszcz', emoji: '🌧️' }
  if (code >= 71 && code <= 77) return { label: 'Śnieg', emoji: '❄️' }
  if (code >= 80 && code <= 82) return { label: 'Przelotne opady', emoji: '🌦️' }
  if (code === 85 || code === 86) return { label: 'Przelotny śnieg', emoji: '🌨️' }
  if (code >= 95) return { label: 'Burza', emoji: '⛈️' }
  return { label: 'Pogoda nieznana', emoji: '❓' }
}
