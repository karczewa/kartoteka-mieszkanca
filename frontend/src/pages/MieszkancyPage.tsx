import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCitizens } from '../api/citizens'
import RegisterModal from '../components/RegisterModal'
import type { CitizenListItem } from '../types'

export default function MieszkancyPage() {
  const navigate = useNavigate()
  const [citizens, setCitizens] = useState<CitizenListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  async function load(q?: string) {
    setLoading(true)
    setError(null)
    try {
      setCitizens(await fetchCitizens(q || undefined))
    } catch {
      setError('Nie udało się pobrać listy mieszkańców.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(debouncedQuery) }, [debouncedQuery])

  const filtered = citizens

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Mieszkańcy</h1>
        <button
          onClick={() => setShowRegister(true)}
          className="bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          Zarejestruj nowego mieszkańca
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Wyszukaj po imieniu, nazwisku, PESEL lub mieście…"
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-16 text-sm">Ładowanie…</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center text-gray-400 py-16 text-sm">
          {query ? 'Brak wyników dla podanego zapytania.' : 'Brak zarejestrowanych mieszkańców.'}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nazwisko i imię</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">PESEL</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Miasto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/mieszkancy/${c.id}`)}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">{c.nazwisko} {c.imie}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono">{c.pesel}</td>
                  <td className="px-4 py-3 text-gray-600">{c.miasto ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onCreated={() => { setShowRegister(false); load(debouncedQuery) }}
        />
      )}
    </div>
  )
}
