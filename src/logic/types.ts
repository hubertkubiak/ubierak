export interface Weather {
  temperature: number
  apparent: number
  precipitation: number
  rain: number
  snowfall: number
  weatherCode: number
  windSpeed: number
  uvIndex: number
  isDay: boolean
  /** Min/max over the next 12 hours. */
  minTemp: number
  maxTemp: number
  maxPrecipProb: number
}

export type Zone = 'arctic' | 'frost' | 'cold' | 'brisk' | 'pleasant' | 'warm' | 'hot'
export type Mood = 'terrified' | 'freezing' | 'happy' | 'sweaty' | 'melting'

export type Legwear = 'shorts' | 'pants' | 'thermal'
export type Top = 'tanktop' | 'tshirt' | 'longsleeve'
export type Mid = 'none' | 'hoodie' | 'sweater'
export type Outer = 'none' | 'light' | 'jacket' | 'winter' | 'puffer' | 'raincoat'
export type Headwear = 'none' | 'beanie' | 'cap'
export type Footwear = 'flipflops' | 'sneakers' | 'shoes' | 'boots'

export interface Outfit {
  legwear: Legwear
  top: Top
  mid: Mid
  outer: Outer
  head: Headwear
  feet: Footwear
  scarf: boolean
  gloves: boolean
  umbrella: boolean
  sunglasses: boolean
  /** Spare hoodie tied around the waist. */
  spareLayer: boolean
}

export interface Advice {
  zone: Zone
  mood: Mood
  effective: number
  outfit: Outfit
  items: string[]
  tips: string[]
  /** Raining with no umbrella: the character gets wet hair. */
  wet: boolean
  snowing: boolean
  raining: boolean
}
