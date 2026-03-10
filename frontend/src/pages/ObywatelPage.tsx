import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteCitizen, fetchCitizen } from '../api/citizens'
import EditModal from '../components/EditModal'
import type { Citizen } from '../types'

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{label}</dt>
      <dd className="text-sm text-gray-800">{value ?? '—'}</dd>
    </div>
  )
}

export default function ObywatelPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [citizen, setCitizen] = useState<Citizen | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEdit, setShowEdit] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchCitizen(Number(id))
      .then(setCitizen)
      .catch(() => setError('Nie znaleziono mieszkańca.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!citizen) return
    setDeleting(true)
    try {
      await deleteCitizen(citizen.id)
      navigate('/mieszkancy')
    } catch {
      setError('Nie udało się usunąć mieszkańca.')
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="text-center text-gray-400 py-16 text-sm">Ładowanie…</div>
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">{error}</div>
  if (!citizen) return null

  const adres = citizen.adres_zameldowania
  const koresp = citizen.adres_korespondencyjny

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/mieszkancy')}
          className="text-blue-700 text-sm hover:underline">&larr; Powrót</button>
        <h1 className="text-2xl font-semibold text-gray-800 flex-1">
          {citizen.imie} {citizen.nazwisko}
        </h1>
        <div className="flex gap-2">
          <button onClick={() => setShowEdit(true)}
            className="border border-blue-700 text-blue-700 px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors">
            Edytuj
          </button>
          <button onClick={() => setShowDeleteConfirm(true)}
            className="border border-red-500 text-red-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-red-50 transition-colors">
            Usuń
          </button>
        </div>
      </div>

      {/* Dane osobowe */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Dane osobowe</h2>
        <dl className="grid grid-cols-2 gap-4">
          <Field label="PESEL" value={citizen.pesel} />
          <Field label="Płeć" value={citizen.plec === 'M' ? 'Mężczyzna' : 'Kobieta'} />
          <Field label="Imię" value={citizen.imie} />
          <Field label="Nazwisko" value={citizen.nazwisko} />
          <Field label="Data urodzenia" value={citizen.data_urodzenia} />
        </dl>
      </div>

      {/* Adres zameldowania */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Adres zameldowania</h2>
        {adres ? (
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Ulica" value={adres.ulica} />
            <Field label="Nr domu" value={adres.nr_domu} />
            <Field label="Nr mieszkania" value={adres.nr_mieszkania} />
            <Field label="Miasto" value={adres.miasto} />
            <Field label="Kod pocztowy" value={adres.kod_pocztowy} />
            <Field label="Typ zameldowania" value={adres.typ_zameldowania === 'stale' ? 'Stałe' : 'Tymczasowe'} />
            <Field label="Data zameldowania" value={adres.data_zameldowania} />
          </dl>
        ) : (
          <p className="text-sm text-gray-400">Brak danych adresowych.</p>
        )}
      </div>

      {/* Dane kontaktowe */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Dane kontaktowe</h2>
        <dl className="grid grid-cols-2 gap-4">
          <Field label="Telefon" value={citizen.telefon} />
          <Field label="E-mail" value={citizen.email} />
        </dl>
      </div>

      {/* Adres korespondencyjny */}
      {koresp && (
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Adres korespondencyjny</h2>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Ulica" value={koresp.ulica} />
            <Field label="Nr domu" value={koresp.nr_domu} />
            <Field label="Nr mieszkania" value={koresp.nr_mieszkania} />
            <Field label="Miasto" value={koresp.miasto} />
            <Field label="Kod pocztowy" value={koresp.kod_pocztowy} />
          </dl>
        </div>
      )}

      {/* Edit modal */}
      {showEdit && (
        <EditModal
          citizen={citizen}
          onClose={() => setShowEdit(false)}
          onUpdated={updated => { setCitizen(updated); setShowEdit(false) }}
        />
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Usuń mieszkańca</h2>
            <p className="text-sm text-gray-600 mb-6">
              Czy na pewno chcesz usunąć kartotekę <strong>{citizen.imie} {citizen.nazwisko}</strong>?
              Operacja jest nieodwracalna.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                Anuluj
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="bg-red-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
                {deleting ? 'Usuwanie…' : 'Usuń'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
