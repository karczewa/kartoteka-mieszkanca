import { useState } from 'react'

export default function MieszkancyPage() {
  const [query, setQuery] = useState('')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Mieszkańcy</h1>
        <button className="bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition-colors">
          Zarejestruj nowego mieszkańca
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Wyszukaj po imieniu, nazwisku, PESEL lub adresie…"
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="text-center text-gray-400 py-16 text-sm">
        Wpisz dane w polu wyszukiwania, aby znaleźć mieszkańca.
      </div>
    </div>
  )
}
