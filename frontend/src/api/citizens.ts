import type { Citizen, CitizenListItem } from '../types'

const BASE = '/api/citizens'

export async function fetchCitizens(): Promise<CitizenListItem[]> {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Błąd pobierania listy mieszkańców')
  return res.json()
}

export async function fetchCitizen(id: number): Promise<Citizen> {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error('Nie znaleziono mieszkańca')
  return res.json()
}

export async function createCitizen(data: Record<string, unknown>): Promise<Citizen> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(err.detail ?? 'Błąd rejestracji mieszkańca')
  }
  return res.json()
}

export async function updateCitizen(id: number, data: Record<string, unknown>): Promise<Citizen> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(err.detail ?? 'Błąd aktualizacji danych')
  }
  return res.json()
}

export async function deleteCitizen(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Błąd usuwania mieszkańca')
}
