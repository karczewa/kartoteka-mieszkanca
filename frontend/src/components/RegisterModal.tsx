import { useState } from 'react'
import { createCitizen } from '../api/citizens'

interface Props {
  onClose: () => void
  onCreated: () => void
}

const EMPTY = {
  pesel: '', imie: '', nazwisko: '',
  adres_ulica: '', adres_nr_domu: '', adres_nr_mieszkania: '',
  adres_miasto: '', adres_kod_pocztowy: '',
  adres_typ_zameldowania: 'stale' as 'stale' | 'tymczasowe',
  adres_data_zameldowania: '',
  telefon: '', email: '',
  koresp_ulica: '', koresp_nr_domu: '', koresp_nr_mieszkania: '',
  koresp_miasto: '', koresp_kod_pocztowy: '',
}

export default function RegisterModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function set(field: keyof typeof EMPTY, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const payload: Record<string, unknown> = {
        pesel: form.pesel,
        imie: form.imie,
        nazwisko: form.nazwisko,
        adres_ulica: form.adres_ulica,
        adres_nr_domu: form.adres_nr_domu,
        adres_miasto: form.adres_miasto,
        adres_kod_pocztowy: form.adres_kod_pocztowy,
        adres_typ_zameldowania: form.adres_typ_zameldowania,
        adres_data_zameldowania: form.adres_data_zameldowania,
      }
      if (form.adres_nr_mieszkania) payload.adres_nr_mieszkania = form.adres_nr_mieszkania
      if (form.telefon) payload.telefon = form.telefon
      if (form.email) payload.email = form.email
      if (form.koresp_ulica) payload.koresp_ulica = form.koresp_ulica
      if (form.koresp_nr_domu) payload.koresp_nr_domu = form.koresp_nr_domu
      if (form.koresp_nr_mieszkania) payload.koresp_nr_mieszkania = form.koresp_nr_mieszkania
      if (form.koresp_miasto) payload.koresp_miasto = form.koresp_miasto
      if (form.koresp_kod_pocztowy) payload.koresp_kod_pocztowy = form.koresp_kod_pocztowy

      await createCitizen(payload)
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Rejestracja nowego mieszkańca</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          {/* Dane osobowe */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Dane osobowe</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm text-gray-700 mb-1">PESEL *</label>
                <input required maxLength={11} value={form.pesel} onChange={e => set('pesel', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
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

          {/* Adres zameldowania */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Adres zameldowania</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Ulica *</label>
                <input required value={form.adres_ulica} onChange={e => set('adres_ulica', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nr domu *</label>
                <input required value={form.adres_nr_domu} onChange={e => set('adres_nr_domu', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nr mieszkania</label>
                <input value={form.adres_nr_mieszkania} onChange={e => set('adres_nr_mieszkania', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Miasto *</label>
                <input required value={form.adres_miasto} onChange={e => set('adres_miasto', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Kod pocztowy *</label>
                <input required value={form.adres_kod_pocztowy} onChange={e => set('adres_kod_pocztowy', e.target.value)}
                  placeholder="00-000"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Typ zameldowania *</label>
                <select required value={form.adres_typ_zameldowania} onChange={e => set('adres_typ_zameldowania', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="stale">Stałe</option>
                  <option value="tymczasowe">Tymczasowe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Data zameldowania *</label>
                <input required type="date" value={form.adres_data_zameldowania} onChange={e => set('adres_data_zameldowania', e.target.value)}
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
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Adres korespondencyjny <span className="font-normal normal-case">(jeśli inny niż zameldowania)</span></h3>
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
              {loading ? 'Rejestrowanie…' : 'Zarejestruj'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
