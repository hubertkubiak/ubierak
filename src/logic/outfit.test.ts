import { describe, expect, it } from 'vitest'
import { advise, effectiveTemp, moodFor, zoneFor } from './outfit'
import { moodQuip, zoneQuip } from './quips'
import type { Weather } from './types'

const calm: Weather = {
  temperature: 15,
  apparent: 15,
  precipitation: 0,
  rain: 0,
  snowfall: 0,
  weatherCode: 0,
  windSpeed: 5,
  uvIndex: 2,
  isDay: true,
  minTemp: 12,
  maxTemp: 17,
  maxPrecipProb: 0,
}

describe('effectiveTemp', () => {
  it('shifts 2°C per preference point', () => {
    expect(effectiveTemp(10, 0)).toBe(10)
    expect(effectiveTemp(10, -5)).toBe(0)
    expect(effectiveTemp(10, 5)).toBe(20)
  })
})

describe('zoneFor', () => {
  it.each([
    [-10.1, 'arctic'],
    [-10, 'frost'],
    [-0.1, 'frost'],
    [0, 'cold'],
    [7.9, 'cold'],
    [8, 'brisk'],
    [14, 'pleasant'],
    [19.9, 'pleasant'],
    [20, 'warm'],
    [26, 'warm'],
    [26.1, 'hot'],
  ])('%s°C → %s', (t, zone) => {
    expect(zoneFor(t)).toBe(zone)
  })
})

describe('moodFor', () => {
  it.each([
    [2.9, 'terrified'],
    [3, 'freezing'],
    [11.9, 'freezing'],
    [12, 'happy'],
    [24, 'happy'],
    [24.1, 'sweaty'],
    [30, 'sweaty'],
    [30.1, 'melting'],
  ])('%s°C → %s', (t, mood) => {
    expect(moodFor(t)).toBe(mood)
  })
})

describe('advise', () => {
  it('dresses a cold-lover lighter than a freezer in the same weather', () => {
    const freezer = advise(calm, -5)
    const furnace = advise(calm, 5)
    expect(freezer.zone).toBe('cold')
    expect(freezer.outfit.outer).toBe('jacket')
    expect(furnace.zone).toBe('warm')
    expect(furnace.outfit.legwear).toBe('shorts')
  })

  it('adds an umbrella when rain is likely and wind is calm', () => {
    const a = advise({ ...calm, maxPrecipProb: 70 }, 0)
    expect(a.outfit.umbrella).toBe(true)
    expect(a.wet).toBe(false)
    expect(a.items).toContain('parasol')
  })

  it('swaps the umbrella for a raincoat when it is windy', () => {
    const a = advise({ ...calm, rain: 1, windSpeed: 45 }, 0)
    expect(a.outfit.umbrella).toBe(false)
    expect(a.outfit.outer).toBe('raincoat')
    expect(a.wet).toBe(true)
  })

  it('puts on boots when it snows', () => {
    const a = advise({ ...calm, apparent: -3, snowfall: 0.5, weatherCode: 73 }, 0)
    expect(a.outfit.feet).toBe('boots')
    expect(a.raining).toBe(false)
    expect(a.tips.some((t) => t.includes('bałwan'))).toBe(true)
  })

  it('adds sunglasses and sunscreen at high UV', () => {
    const a = advise({ ...calm, uvIndex: 7 }, 0)
    expect(a.outfit.sunglasses).toBe(true)
    expect(a.tips.some((t) => t.includes('krem'))).toBe(true)
  })

  it('suggests a spare layer when the day swings a lot', () => {
    const a = advise({ ...calm, apparent: 24, minTemp: 12, maxTemp: 25 }, 0)
    expect(a.outfit.spareLayer).toBe(true)
  })
})

describe('quips', () => {
  it('are stable for the same input', () => {
    expect(zoneQuip('hot', 3)).toBe(zoneQuip('hot', 3))
    expect(moodQuip('happy', -2)).toBe(moodQuip('happy', -2))
  })
})
