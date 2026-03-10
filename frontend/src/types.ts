export interface CitizenListItem {
  id: number
  pesel: string
  imie: string
  nazwisko: string
  miasto: string | null
}

export interface AdresZameldowania {
  ulica: string
  nr_domu: string
  nr_mieszkania: string | null
  miasto: string
  kod_pocztowy: string
  typ_zameldowania: 'stale' | 'tymczasowe'
  data_zameldowania: string
}

export interface AdresKorespondencyjny {
  ulica: string | null
  nr_domu: string | null
  nr_mieszkania: string | null
  miasto: string | null
  kod_pocztowy: string | null
}

export interface Citizen {
  id: number
  pesel: string
  imie: string
  nazwisko: string
  data_urodzenia: string
  plec: 'M' | 'K'
  telefon: string | null
  email: string | null
  adres_zameldowania: AdresZameldowania | null
  adres_korespondencyjny: AdresKorespondencyjny | null
}
