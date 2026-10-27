import type { ReactNode } from 'react'

interface Props {
  isDay: boolean
  cloudy: boolean
  raining: boolean
  snowing: boolean
  children: ReactNode
}

const DROPS = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 13) % 10) / 10,
  duration: 0.6 + ((i * 7) % 5) / 10,
}))

export function WeatherBackdrop({ isDay, cloudy, raining, snowing, children }: Props) {
  return (
    <div className={`backdrop ${isDay ? 'day' : 'night'}`}>
      <div className={isDay ? 'sun' : 'moon'} />
      {cloudy && (
        <>
          <div className="cloud cloud-1" />
          <div className="cloud cloud-2" />
        </>
      )}
      {(raining || snowing) && (
        <div className="precip" aria-hidden>
          {DROPS.map((d, i) => (
            <span
              key={i}
              className={snowing ? 'flake' : 'drop'}
              style={{
                left: `${d.left}%`,
                animationDelay: `${d.delay * (snowing ? 4 : 1)}s`,
                animationDuration: `${d.duration * (snowing ? 4 : 1)}s`,
              }}
            >
              {snowing ? '❄' : null}
            </span>
          ))}
        </div>
      )}
      <div className="ground" />
      {children}
    </div>
  )
}
