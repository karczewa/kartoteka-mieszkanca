import { useState } from 'react'
import { updateCitizen } from '../api/citizens'
import type { Citizen } from '../types'

interface Props {
  citizen: Citizen
  onClose: () => void
  onUpdated: (c: Citizen) => void
}

export default function EditModal({ citizen, onClose, onUpdated }: Props) {
  const [form, setForm] = useState({
    imie: citizen.imie,
    nazwisko: citizen.nazwisko,
    telefon: citizen.telefon ?? '',
    email: citizen.email ?? '',
    koresp_ulica: citizen.adres_korespondencyjny?.ulica ?? '',
    koresp_nr_domu: citizen.adres_korespondencyjny?.nr_domu ?? '',
    koresp_nr_mieszkania: citizen.adres_korespondencyjny?.nr_mieszkania ?? '',
    koresp_miasto: citizen.adres_korespondencyjny?.miasto ?? '',
    koresp_kod_pocztowy: citizen.adres_korespondencyjny?.kod_pocztowy ?? '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const payload: Record<string, unknown> = {}
      if (form.imie !== citizen.imie) payload.imie = form.imie
      if (form.nazwisko !== citizen.nazwisko) payload.nazwisko = form.nazwisko
      payload.telefon = form.telefon || null
      payload.email = form.email || null
      payload.koresp_ulica = form.koresp_ulica || null
      payload.koresp_nr_domu = form.koresp_nr_domu || null
      payload.koresp_nr_mieszkania = form.koresp_nr_mieszkania || null
      payload.koresp_miasto = form.koresp_miasto || null
      payload.koresp_kod_pocztowy = form.koresp_kod_pocztowy || null

      const updated = await updateCitizen(citizen.id, payload)
      onUpdated(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Edycja danych mieszkańca</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          {/* Dane osobowe */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Dane osobowe</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Imię *</label>
                <input required value={form.imie} onChange={e => set('imie', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nazwisko *</label>
                <input required value={form.nazwisko} onChange={e => set('nazwisko', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </section>

          {/* Dane kontaktowe */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Dane kontaktowe</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Telefon</label>
                <input value={form.telefon} onChange={e => set('telefon', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">E-mail</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </section>

          {/* Adres korespondencyjny */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Adres korespondencyjny</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Ulica</label>
                <input value={form.koresp_ulica} onChange={e => set('koresp_ulica', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nr domu</label>
                <input value={form.koresp_nr_domu} onChange={e => set('koresp_nr_domu', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nr mieszkania</label>
                <input value={form.koresp_nr_mieszkania} onChange={e => set('koresp_nr_mieszkania', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Miasto</label>
                <input value={form.koresp_miasto} onChange={e => set('koresp_miasto', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Kod pocztowy</label>
                <input value={form.koresp_kod_pocztowy} onChange={e => set('koresp_kod_pocztowy', e.target.value)}
                  placeholder="00-000"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-2 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
              Anuluj
            </button>
            <button type="submit" disabled={loading}
              className="bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors">
              {loading ? 'Zapisywanie…' : 'Zapisz zmiany'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
