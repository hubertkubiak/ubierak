import type { Advice, Mood, Outfit, Weather, Zone } from './types'

export const DEGREES_PER_POINT = 2
export const COMFORT_POINT = 18

export function effectiveTemp(apparent: number, preference: number): number {
  return apparent + preference * DEGREES_PER_POINT
}

export function zoneFor(effective: number): Zone {
  if (effective < -10) return 'arctic'
  if (effective < 0) return 'frost'
  if (effective < 8) return 'cold'
  if (effective < 14) return 'brisk'
  if (effective < 20) return 'pleasant'
  if (effective <= 26) return 'warm'
  return 'hot'
}

export function moodFor(effective: number): Mood {
  const comfort = effective - COMFORT_POINT
  if (comfort < -15) return 'terrified'
  if (comfort < -6) return 'freezing'
  if (comfort <= 6) return 'happy'
  if (comfort <= 12) return 'sweaty'
  return 'melting'
}

const NAKED: Outfit = {
  legwear: 'pants',
  top: 'tshirt',
  mid: 'none',
  outer: 'none',
  head: 'none',
  feet: 'sneakers',
  scarf: false,
  gloves: false,
  umbrella: false,
  sunglasses: false,
  spareLayer: false,
}

const BASE_OUTFITS: Record<Zone, Outfit> = {
  arctic: { ...NAKED, legwear: 'thermal', top: 'longsleeve', mid: 'sweater', outer: 'puffer', head: 'beanie', feet: 'boots', scarf: true, gloves: true },
  frost: { ...NAKED, top: 'longsleeve', mid: 'sweater', outer: 'winter', head: 'beanie', feet: 'boots', scarf: true, gloves: true },
  cold: { ...NAKED, top: 'longsleeve', mid: 'sweater', outer: 'jacket', head: 'beanie', feet: 'shoes' },
  brisk: { ...NAKED, top: 'tshirt', mid: 'hoodie', outer: 'light' },
  pleasant: { ...NAKED, top: 'longsleeve', spareLayer: true },
  warm: { ...NAKED, legwear: 'shorts', top: 'tshirt' },
  hot: { ...NAKED, legwear: 'shorts', top: 'tanktop', feet: 'flipflops', head: 'cap', sunglasses: true },
}

const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86])
const RAIN_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99])

export function isSnowing(w: Weather): boolean {
  return w.snowfall > 0 || SNOW_CODES.has(w.weatherCode)
}

export function isRaining(w: Weather): boolean {
  return w.rain > 0 || RAIN_CODES.has(w.weatherCode) || w.maxPrecipProb > 50
}

const LABELS = {
  legwear: { shorts: 'szorty', pants: 'długie spodnie', thermal: 'kalesony + ciepłe spodnie' },
  top: { tanktop: 'koszulka bez rękawów', tshirt: 't-shirt', longsleeve: 'koszulka z długim rękawem' },
  mid: { none: null, hoodie: 'bluza', sweater: 'gruby sweter' },
  outer: { none: null, light: 'lekka kurtka', jacket: 'kurtka', winter: 'zimowa kurtka', puffer: 'kurtka puchowa', raincoat: 'kurtka przeciwdeszczowa' },
  head: { none: null, beanie: 'czapka', cap: 'czapka z daszkiem' },
  feet: { flipflops: 'klapki', sneakers: 'sneakersy', shoes: 'pełne buty', boots: 'ciepłe buty za kostkę' },
} as const

export function describeOutfit(o: Outfit): string[] {
  const items: (string | null)[] = [
    LABELS.head[o.head],
    o.sunglasses ? 'okulary przeciwsłoneczne' : null,
    o.scarf ? 'szalik' : null,
    LABELS.outer[o.outer],
    LABELS.mid[o.mid],
    LABELS.top[o.top],
    o.gloves ? 'rękawiczki' : null,
    LABELS.legwear[o.legwear],
    LABELS.feet[o.feet],
    o.spareLayer ? 'bluza na zapas (w pasie albo w plecaku)' : null,
    o.umbrella ? 'parasol' : null,
  ]
  return items.filter((i): i is string => i !== null)
}

export const WINDY_KMH = 30

export function advise(w: Weather, preference: number): Advice {
  const effective = effectiveTemp(w.apparent, preference)
  const zone = zoneFor(effective)
  const mood = moodFor(effective)
  const outfit: Outfit = { ...BASE_OUTFITS[zone] }
  const tips: string[] = []

  const raining = isRaining(w)
  const snowing = isSnowing(w)

  if (raining && !snowing) {
    if (w.windSpeed > WINDY_KMH) {
      if (outfit.outer === 'none' || outfit.outer === 'light') outfit.outer = 'raincoat'
      tips.push('Wieje tak, że parasol odleci do sąsiedniego województwa. Kaptur na głowę!')
    } else {
      outfit.umbrella = true
      tips.push('Weź parasol. Mokre skarpetki to najgorsze uczucie świata.')
    }
    if (outfit.feet === 'flipflops' || outfit.feet === 'sneakers') outfit.feet = 'shoes'
  }

  if (snowing) {
    outfit.feet = 'boots'
    tips.push('Pada śnieg! Buty za kostkę, a po pracy obowiązkowo bałwan.')
  }

  if (w.uvIndex >= 6) {
    outfit.sunglasses = true
    tips.push(`UV ${Math.round(w.uvIndex)}: krem z filtrem, chyba że chcesz wyglądać jak homar.`)
  }

  if (w.maxTemp - w.minTemp > 8) {
    if (outfit.mid === 'none') outfit.spareLayer = true
    tips.push(
      `W ciągu dnia od ${Math.round(w.minTemp)}° do ${Math.round(w.maxTemp)}°. Weź warstwę na później, pogoda lubi zmieniać zdanie.`,
    )
  }

  return {
    zone,
    mood,
    effective,
    outfit,
    items: describeOutfit(outfit),
    tips,
    wet: raining && !snowing && !outfit.umbrella,
    snowing,
    raining: raining && !snowing,
  }
}
