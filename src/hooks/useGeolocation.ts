import { useEffect, useState } from 'react'

export type GeoState =
  | { status: 'pending' }
  | { status: 'ok'; lat: number; lon: number }
  | { status: 'error'; message: string }

export function useGeolocation(): GeoState {
  const [state, setState] = useState<GeoState>(() =>
    'geolocation' in navigator
      ? { status: 'pending' }
      : { status: 'error', message: 'Twoja przeglądarka nie zdradza, gdzie jesteś.' },
  )

  useEffect(() => {
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({ status: 'ok', lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) =>
        setState({
          status: 'error',
          message:
            err.code === err.PERMISSION_DENIED
              ? 'Ukrywasz się? Spoko, wpisz miasto.'
              : 'Nie udało się Cię namierzyć. Wpisz miasto.',
        }),
      { timeout: 10_000, maximumAge: 10 * 60_000 },
    )
  }, [])

  return state
}
