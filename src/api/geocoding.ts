export interface Place {
  name: string
  lat: number
  lon: number
  /** e.g. "Mazowieckie, Polska" */
  detail?: string
}

interface SearchResponse {
  results?: { name: string; latitude: number; longitude: number; admin1?: string; country?: string }[]
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const params = new URLSearchParams({ name: query, count: '5', language: 'pl', format: 'json' })
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, { signal })
  if (!res.ok) throw new Error(`Geocoding: ${res.status}`)
  const data: SearchResponse = await res.json()
  return (data.results ?? []).map((r) => ({
    name: r.name,
    lat: r.latitude,
    lon: r.longitude,
    detail: [r.admin1, r.country].filter(Boolean).join(', '),
  }))
}

interface ReverseResponse {
  city?: string
  locality?: string
  principalSubdivision?: string
  countryName?: string
}

export async function reverseGeocode(lat: number, lon: number, signal?: AbortSignal): Promise<string> {
  const params = new URLSearchParams({ latitude: String(lat), longitude: String(lon), localityLanguage: 'pl' })
  const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`, { signal })
  if (!res.ok) throw new Error(`Reverse geocoding: ${res.status}`)
  const data: ReverseResponse = await res.json()
  return data.city || data.locality || data.principalSubdivision || data.countryName || 'Twoja okolica'
}
