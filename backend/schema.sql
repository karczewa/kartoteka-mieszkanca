-- Kartoteka Mieszkańca — Database Schema
-- Auto-generated reference file. Do not edit manually.
-- Managed via Alembic migrations.

CREATE TABLE citizens (
    id INTEGER NOT NULL PRIMARY KEY,
    pesel VARCHAR(11) NOT NULL UNIQUE,
    imie VARCHAR(100) NOT NULL,
    nazwisko VARCHAR(100) NOT NULL,
    data_urodzenia DATE NOT NULL,
    plec VARCHAR(1) NOT NULL CHECK (plec IN ('M', 'K')),
    telefon VARCHAR(20),
    email VARCHAR(200),
    -- Correspondence address (optional)
    koresp_ulica VARCHAR(200),
    koresp_nr_domu VARCHAR(20),
    koresp_nr_mieszkania VARCHAR(20),
    koresp_miasto VARCHAR(100),
    koresp_kod_pocztowy VARCHAR(10)
);

CREATE UNIQUE INDEX ix_citizens_pesel ON citizens (pesel);

CREATE TABLE identity_documents (
    id INTEGER NOT NULL PRIMARY KEY,
    obywatel_id INTEGER NOT NULL REFERENCES citizens (id),
    typ VARCHAR(20) NOT NULL CHECK (typ IN ('dowod', 'paszport')),
    seria VARCHAR(10) NOT NULL,        -- letters only (A-Z), enforced by API
    numer VARCHAR(20) NOT NULL,        -- digits only (0-9), enforced by API
    data_wydania DATE NOT NULL,
    data_waznosci DATE NOT NULL,
    organ_wydajacy VARCHAR(200) NOT NULL,
    is_active BOOLEAN NOT NULL
);

CREATE TABLE registration_entries (
    id INTEGER NOT NULL PRIMARY KEY,
    obywatel_id INTEGER NOT NULL REFERENCES citizens (id),
    ulica VARCHAR(200) NOT NULL,
    nr_domu VARCHAR(20) NOT NULL,
    nr_mieszkania VARCHAR(20),
    miasto VARCHAR(100) NOT NULL,
    kod_pocztowy VARCHAR(10) NOT NULL,
    typ_zameldowania VARCHAR(20) NOT NULL CHECK (typ_zameldowania IN ('stale', 'tymczasowe')),
    data_zameldowania DATE NOT NULL,
    is_current BOOLEAN NOT NULL
);

CREATE TABLE audit_log (
    id INTEGER NOT NULL PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    typ_operacji VARCHAR(20) NOT NULL CHECK (typ_operacji IN ('CREATE', 'UPDATE', 'DELETE', 'VIEW')),
    opis VARCHAR(500) NOT NULL,
    obywatel_id INTEGER REFERENCES citizens (id),
    dane_przed JSON,   -- snapshot of record before change (NULL for CREATE/VIEW); displayed as table in UI
    dane_po JSON       -- snapshot of record after change (NULL for DELETE/VIEW); displayed as table in UI
);
