import { useCallback, useEffect, useState } from 'react'
import { fetchWeather } from '../api/weather'
import type { Weather } from '../logic/types'

export type WeatherState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; weather: Weather }
  | { status: 'error' }

export function useWeather(coords: { lat: number; lon: number } | null) {
  const [state, setState] = useState<WeatherState>({ status: 'idle' })
  const [attempt, setAttempt] = useState(0)
  const lat = coords?.lat
  const lon = coords?.lon

  useEffect(() => {
    if (lat === undefined || lon === undefined) return
    const ctrl = new AbortController()
    setState({ status: 'loading' })
    fetchWeather(lat, lon, ctrl.signal)
      .then((weather) => setState({ status: 'ok', weather }))
      .catch((e: unknown) => {
        if (!ctrl.signal.aborted) {
          console.error(e)
          setState({ status: 'error' })
        }
      })
    return () => ctrl.abort()
  }, [lat, lon, attempt])

  const retry = useCallback(() => setAttempt((a) => a + 1), [])
  return { state, retry }
}
