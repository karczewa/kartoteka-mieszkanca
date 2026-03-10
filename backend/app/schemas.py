from datetime import date
from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, field_validator


# ---------------------------------------------------------------------------
# Address sub-schemas (reused in multiple places)
# ---------------------------------------------------------------------------

class AdresBase(BaseModel):
    ulica: str
    nr_domu: str
    nr_mieszkania: Optional[str] = None
    miasto: str
    kod_pocztowy: str


class AdresKorespondencyjny(BaseModel):
    koresp_ulica: Optional[str] = None
    koresp_nr_domu: Optional[str] = None
    koresp_nr_mieszkania: Optional[str] = None
    koresp_miasto: Optional[str] = None
    koresp_kod_pocztowy: Optional[str] = None


# ---------------------------------------------------------------------------
# Citizen schemas
# ---------------------------------------------------------------------------

class CitizenCreate(BaseModel):
    pesel: str
    imie: str
    nazwisko: str

    # Registered address (required on creation)
    adres_ulica: str
    adres_nr_domu: str
    adres_nr_mieszkania: Optional[str] = None
    adres_miasto: str
    adres_kod_pocztowy: str
    adres_typ_zameldowania: Literal["stale", "tymczasowe"]
    adres_data_zameldowania: date

    # Contact (optional)
    telefon: Optional[str] = None
    email: Optional[str] = None

    # Correspondence address (optional)
    koresp_ulica: Optional[str] = None
    koresp_nr_domu: Optional[str] = None
    koresp_nr_mieszkania: Optional[str] = None
    koresp_miasto: Optional[str] = None
    koresp_kod_pocztowy: Optional[str] = None

    @field_validator("pesel")
    @classmethod
    def pesel_must_be_digits(cls, v: str) -> str:
        if not v.isdigit() or len(v) != 11:
            raise ValueError("PESEL musi składać się z 11 cyfr")
        return v

    @field_validator("imie", "nazwisko")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Pole nie może być puste")
        return v.strip()


class CitizenUpdate(BaseModel):
    imie: Optional[str] = None
    nazwisko: Optional[str] = None
    telefon: Optional[str] = None
    email: Optional[str] = None
    koresp_ulica: Optional[str] = None
    koresp_nr_domu: Optional[str] = None
    koresp_nr_mieszkania: Optional[str] = None
    koresp_miasto: Optional[str] = None
    koresp_kod_pocztowy: Optional[str] = None

    @field_validator("imie", "nazwisko")
    @classmethod
    def not_empty_if_provided(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("Pole nie może być puste")
        return v.strip() if v else v


class CitizenRead(BaseModel):
    id: int
    pesel: str
    imie: str
    nazwisko: str
    data_urodzenia: date
    plec: Literal["M", "K"]
    telefon: Optional[str] = None
    email: Optional[str] = None
    koresp_ulica: Optional[str] = None
    koresp_nr_domu: Optional[str] = None
    koresp_nr_mieszkania: Optional[str] = None
    koresp_miasto: Optional[str] = None
    koresp_kod_pocztowy: Optional[str] = None

    model_config = {"from_attributes": True}


class CitizenListItem(BaseModel):
    id: int
    pesel: str
    imie: str
    nazwisko: str
    miasto: Optional[str] = None  # from current registration entry

    model_config = {"from_attributes": True}
