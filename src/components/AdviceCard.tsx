import { moodQuip, ZONE_NAMES, zoneQuip } from '../logic/quips'
import type { Advice } from '../logic/types'

interface Props {
  advice: Advice
  preference: number
  apparent: number
}

export function AdviceCard({ advice, preference, apparent }: Props) {
  const shift = Math.round(advice.effective - apparent)
  return (
    <section className="advice card" aria-live="polite">
      <div className="advice-head">
        <span className={`zone zone-${advice.zone}`}>{ZONE_NAMES[advice.zone]}</span>
        <span className="feels">
          Dla Ciebie to jak <strong>{Math.round(advice.effective)}°C</strong>
          {shift !== 0 && (
            <small>
              {' '}
              ({shift > 0 ? '+' : ''}
              {shift}° za temperament)
            </small>
          )}
        </span>
      </div>
      <p className="quip">„{zoneQuip(advice.zone, preference)}”</p>
      <h2>Załóż:</h2>
      <ul className="items">
        {advice.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {advice.tips.length > 0 && (
        <ul className="tips">
          {advice.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      )}
      <p className="mood-quip">{moodQuip(advice.mood, preference)}</p>
    </section>
  )
}
