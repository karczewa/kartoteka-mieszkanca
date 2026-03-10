from typing import Any, Optional
from sqlmodel import Session

from app.models import AuditLog, Citizen


def _citizen_snapshot(citizen: Citizen) -> dict[str, Any]:
    return {
        "pesel": citizen.pesel,
        "imie": citizen.imie,
        "nazwisko": citizen.nazwisko,
        "data_urodzenia": str(citizen.data_urodzenia),
        "plec": citizen.plec,
        "telefon": citizen.telefon,
        "email": citizen.email,
        "koresp_ulica": citizen.koresp_ulica,
        "koresp_nr_domu": citizen.koresp_nr_domu,
        "koresp_nr_mieszkania": citizen.koresp_nr_mieszkania,
        "koresp_miasto": citizen.koresp_miasto,
        "koresp_kod_pocztowy": citizen.koresp_kod_pocztowy,
    }


def log_action(
    session: Session,
    *,
    typ_operacji: str,
    opis: str,
    obywatel_id: Optional[int] = None,
    dane_przed: Optional[dict] = None,
    dane_po: Optional[dict] = None,
) -> None:
    entry = AuditLog(
        typ_operacji=typ_operacji,
        opis=opis,
        obywatel_id=obywatel_id,
        dane_przed=dane_przed,
        dane_po=dane_po,
    )
    session.add(entry)
