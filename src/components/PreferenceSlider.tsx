import type { CSSProperties } from 'react'
import { PREFERENCE_LABELS } from '../logic/quips'

interface Props {
  value: number
  onChange: (value: number) => void
}

export function PreferenceSlider({ value, onChange }: Props) {
  return (
    <div className="slider card">
      <label htmlFor="pref" className="slider-title">
        Jak znosisz temperaturę?
      </label>
      <output htmlFor="pref" className="slider-value">
        {PREFERENCE_LABELS[value]}
      </output>
      <input
        id="pref"
        type="range"
        min={-5}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--pct': `${((value + 5) / 10) * 100}%` } as CSSProperties}
      />
      <div className="slider-ends">
        <span>🥶 Zmarzluch</span>
        <span>Piecyk 🔥</span>
      </div>
    </div>
  )
}
