import { useEffect, useMemo, useState } from 'react'
import { reverseGeocode, type Place } from './api/geocoding'
import { describeWeatherCode } from './api/weather'
import { AdviceCard } from './components/AdviceCard'
import { Character } from './components/Character'
import { LocationPicker } from './components/LocationPicker'
import { PreferenceSlider } from './components/PreferenceSlider'
import { WeatherBackdrop } from './components/WeatherBackdrop'
import { useGeolocation } from './hooks/useGeolocation'
import { useWeather } from './hooks/useWeather'
import { advise } from './logic/outfit'
import type { Outfit, Weather } from './logic/types'

const PREF_KEY = 'ubierak.preference'

const PEEK_OUTFIT: Outfit = {
  legwear: 'pants',
  top: 'tshirt',
  mid: 'hoodie',
  outer: 'none',
  head: 'none',
  feet: 'sneakers',
  scarf: false,
  gloves: false,
  umbrella: false,
  sunglasses: false,
  spareLayer: false,
}

function readPreference(): number {
  try {
    const v = Number(localStorage.getItem(PREF_KEY))
    return Number.isInteger(v) && v >= -5 && v <= 5 ? v : 0
  } catch {
    return 0
  }
}

function WeatherInfo({ weather }: { weather: Weather }) {
  const { label, emoji } = describeWeatherCode(weather.weatherCode, weather.isDay)
  return (
    <div className="weather">
      <div className="weather-main">
        <span className="weather-emoji" aria-hidden>
          {emoji}
        </span>
        <div>
          <div className="weather-temp">{Math.round(weather.temperature)}°C</div>
          <div className="weather-label">{label}</div>
        </div>
      </div>
      <dl className="weather-stats">
        <div>
          <dt>Odczuwalna</dt>
          <dd>{Math.round(weather.apparent)}°</dd>
        </div>
        <div>
          <dt>Wiatr</dt>
          <dd>{Math.round(weather.windSpeed)} km/h</dd>
        </div>
        <div>
          <dt>Opady (12 h)</dt>
          <dd>{Math.round(weather.maxPrecipProb)}%</dd>
        </div>
        <div>
          <dt>UV</dt>
          <dd>{Math.round(weather.uvIndex)}</dd>
        </div>
      </dl>
    </div>
  )
}

export default function App() {
  const geo = useGeolocation()
  const [manualPlace, setManualPlace] = useState<Place | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [geoName, setGeoName] = useState<string | null>(null)
  const [preference, setPreference] = useState(readPreference)

  const coords = useMemo(
    () => (manualPlace ? manualPlace : geo.status === 'ok' ? { lat: geo.lat, lon: geo.lon } : null),
    [manualPlace, geo],
  )
  const { state: weatherState, retry } = useWeather(coords)

  useEffect(() => {
    if (geo.status !== 'ok') return
    const ctrl = new AbortController()
    reverseGeocode(geo.lat, geo.lon, ctrl.signal)
      .then(setGeoName)
      .catch(() => !ctrl.signal.aborted && setGeoName('Twoja okolica'))
    return () => ctrl.abort()
  }, [geo])

  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, String(preference))
    } catch {
      // Private mode etc. – the preference just won't be remembered.
    }
  }, [preference])

  const weather = weatherState.status === 'ok' ? weatherState.weather : null
  const advice = useMemo(() => (weather ? advise(weather, preference) : null), [weather, preference])

  const placeName = manualPlace?.name ?? geoName
  const needsPicker = pickerOpen || (!manualPlace && geo.status === 'error')

  const selectPlace = (p: Place) => {
    setManualPlace(p)
    setPickerOpen(false)
  }

  let status: string | null = null
  if (geo.status === 'pending' && !manualPlace) status = 'Pytam przeglądarkę, gdzie jesteś…'
  else if (weatherState.status === 'loading') status = 'Zaglądam za chmury…'

  return (
    <div className="app">
      <header className="header">
        <h1>
          Ubierak <span aria-hidden>🧥🩳</span>
        </h1>
        <p>Pogoda + Twój temperament = idealny strój.</p>
      </header>

      <main className="grid">
        <div className="col-left">
          <section className="card location">
            {needsPicker ? (
              <LocationPicker
                onSelect={selectPlace}
                onCancel={coords ? () => setPickerOpen(false) : undefined}
                hint={geo.status === 'error' && !manualPlace ? geo.message : undefined}
              />
            ) : (
              <div className="place">
                <span>📍 {placeName ?? '…'}</span>
                <button type="button" className="link" onClick={() => setPickerOpen(true)}>
                  zmień miejsce
                </button>
              </div>
            )}
            {manualPlace && geo.status === 'ok' && !pickerOpen && (
              <button type="button" className="link" onClick={() => setManualPlace(null)}>
                wróć do mojej lokalizacji
              </button>
            )}
            {weather && <WeatherInfo weather={weather} />}
            {weatherState.status === 'error' && (
              <div className="error">
                <p>Chmury zjadły internet. 🌩️</p>
                <button type="button" onClick={retry}>
                  Ponów
                </button>
              </div>
            )}
          </section>
          <div className="slider-wrap">
            <PreferenceSlider value={preference} onChange={setPreference} />
          </div>
        </div>

        <div className="col-center">
          <WeatherBackdrop
            isDay={weather?.isDay ?? true}
            cloudy={(weather?.weatherCode ?? 3) >= 2}
            raining={advice?.raining ?? false}
            snowing={advice?.snowing ?? false}
          >
            <div className={advice ? 'figure' : 'figure peek'}>
              <Character
                outfit={advice?.outfit ?? PEEK_OUTFIT}
                mood={advice?.mood ?? 'happy'}
                wet={advice?.wet ?? false}
              />
            </div>
            {!advice && <div className="cloud cloud-front" />}
            {status && <p className="status">{status}</p>}
          </WeatherBackdrop>
        </div>

        <div className="col-right">
          {advice && weather ? (
            <AdviceCard advice={advice} preference={preference} apparent={weather.apparent} />
          ) : (
            <section className="advice card placeholder">
              <p>Tu pojawi się porada, jak tylko dowiem się, gdzie jesteś.</p>
            </section>
          )}
        </div>
      </main>

      <footer className="footer">
        Dane pogodowe: <a href="https://open-meteo.com/">Open-Meteo</a> · lokalizacja:{' '}
        <a href="https://www.bigdatacloud.com/">BigDataCloud</a>
      </footer>
    </div>
  )
}
