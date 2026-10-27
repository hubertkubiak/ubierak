import { useEffect, useState } from 'react'
import { searchPlaces, type Place } from '../api/geocoding'

interface Props {
  onSelect: (place: Place) => void
  onCancel?: () => void
  hint?: string
}

export function LocationPicker({ onSelect, onCancel, hint }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Place[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      return
    }
    const ctrl = new AbortController()
    const t = window.setTimeout(() => {
      setSearching(true)
      searchPlaces(q, ctrl.signal)
        .then(setResults)
        .catch(() => !ctrl.signal.aborted && setResults([]))
        .finally(() => !ctrl.signal.aborted && setSearching(false))
    }, 300)
    return () => {
      window.clearTimeout(t)
      ctrl.abort()
    }
  }, [query])

  const noResults = !searching && query.trim().length >= 2 && results.length === 0

  return (
    <div className="picker">
      {hint && <p className="picker-hint">{hint}</p>}
      <div className="picker-row">
        <input
          type="search"
          placeholder="Wpisz miasto, np. Kraków"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          aria-label="Miasto"
        />
        {onCancel && (
          <button type="button" className="link" onClick={onCancel}>
            anuluj
          </button>
        )}
      </div>
      {results.length > 0 && (
        <ul className="picker-results">
          {results.map((p) => (
            <li key={`${p.lat},${p.lon}`}>
              <button type="button" onClick={() => onSelect(p)}>
                <strong>{p.name}</strong>
                {p.detail && <span>{p.detail}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
      {searching && <p className="picker-hint">Szukam na mapie…</p>}
      {noResults && <p className="picker-hint">Nie ma takiego miejsca. Albo jest bardzo tajne.</p>}
    </div>
  )
}
