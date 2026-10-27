import { useEffect, useRef, useState, type ReactNode } from 'react'

type Phase = 'on' | 'falling' | 'above'

const TRANSITION_MS = 380

/**
 * A piece of clothing that slides down from above when put on
 * and drops to the floor when taken off.
 */
export function Layer({ on, children }: { on: boolean; children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>(on ? 'on' : 'above')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    window.clearTimeout(timer.current)
    if (on) {
      // Let the browser paint the "above" state first so the slide-in animates.
      timer.current = window.requestAnimationFrame(() => setPhase('on'))
      return () => window.cancelAnimationFrame(timer.current!)
    }
    setPhase((p) => (p === 'on' ? 'falling' : p))
    timer.current = window.setTimeout(() => setPhase('above'), TRANSITION_MS)
    return () => window.clearTimeout(timer.current)
  }, [on])

  return <g className={`layer layer-${phase}`}>{children}</g>
}
