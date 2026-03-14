from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, or_

from app.audit import _citizen_snapshot, log_action
from app.models import Citizen, RegistrationEntry
from app.pesel import parse_pesel
from app.schemas import (
    AdresKorespondencyjnyRead,
    AdresZameldowaniaRead,
    CitizenCreate,
    CitizenListItem,
    CitizenRead,
    CitizenUpdate,
)
from database import get_session

router = APIRouter(prefix="/api/citizens", tags=["Mieszkańcy"])


@router.get("", response_model=list[CitizenListItem])
def list_citizens(
    q: Optional[str] = Query(default=None, description="Filtr po imieniu, nazwisku, PESEL lub mieście"),
    session: Session = Depends(get_session),
):
    stmt = (
        select(Citizen, RegistrationEntry)
        .join(RegistrationEntry, (RegistrationEntry.obywatel_id == Citizen.id) & (RegistrationEntry.is_current == True), isouter=True)
    )
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(
                Citizen.imie.ilike(like),
                Citizen.nazwisko.ilike(like),
                Citizen.pesel.contains(q),
                RegistrationEntry.miasto.ilike(like),
            )
        )
    rows = session.exec(stmt).all()
    return [
        CitizenListItem(
            id=citizen.id,
            pesel=citizen.pesel,
            imie=citizen.imie,
            nazwisko=citizen.nazwisko,
            miasto=entry.miasto if entry else None,
        )
        for citizen, entry in rows
    ]


def _build_citizen_read(citizen: Citizen, session: Session) -> CitizenRead:
    current_entry = session.exec(
        select(RegistrationEntry)
        .where(RegistrationEntry.obywatel_id == citizen.id)
        .where(RegistrationEntry.is_current == True)
    ).first()

    adres_zameldowania = (
        AdresZameldowaniaRead(
            ulica=current_entry.ulica,
            nr_domu=current_entry.nr_domu,
            nr_mieszkania=current_entry.nr_mieszkania,
            miasto=current_entry.miasto,
            kod_pocztowy=current_entry.kod_pocztowy,
            typ_zameldowania=current_entry.typ_zameldowania,
            data_zameldowania=current_entry.data_zameldowania,
        )
        if current_entry
        else None
    )

    has_koresp = any([
        citizen.koresp_ulica,
        citizen.koresp_nr_domu,
        citizen.koresp_miasto,
    ])
    adres_korespondencyjny = (
        AdresKorespondencyjnyRead(
            ulica=citizen.koresp_ulica,
            nr_domu=citizen.koresp_nr_domu,
            nr_mieszkania=citizen.koresp_nr_mieszkania,
            miasto=citizen.koresp_miasto,
            kod_pocztowy=citizen.koresp_kod_pocztowy,
        )
        if has_koresp
        else None
    )

    return CitizenRead(
        id=citizen.id,
        pesel=citizen.pesel,
        imie=citizen.imie,
        nazwisko=citizen.nazwisko,
        data_urodzenia=citizen.data_urodzenia,
        plec=citizen.plec,
        telefon=citizen.telefon,
        email=citizen.email,
        adres_zameldowania=adres_zameldowania,
        adres_korespondencyjny=adres_korespondencyjny,
    )


@router.post("", response_model=CitizenRead, status_code=201)
def register_citizen(payload: CitizenCreate, session: Session = Depends(get_session)):
    existing = session.exec(
        select(Citizen).where(Citizen.pesel == payload.pesel)
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Mieszkaniec z tym numerem PESEL już istnieje")

    data_urodzenia, plec = parse_pesel(payload.pesel)

    citizen = Citizen(
        pesel=payload.pesel,
        imie=payload.imie,
        nazwisko=payload.nazwisko,
        data_urodzenia=data_urodzenia,
        plec=plec,
        telefon=payload.telefon,
        email=payload.email,
        koresp_ulica=payload.koresp_ulica,
        koresp_nr_domu=payload.koresp_nr_domu,
        koresp_nr_mieszkania=payload.koresp_nr_mieszkania,
        koresp_miasto=payload.koresp_miasto,
        koresp_kod_pocztowy=payload.koresp_kod_pocztowy,
    )
    session.add(citizen)
    session.flush()  # get citizen.id before committing

    entry = RegistrationEntry(
        obywatel_id=citizen.id,
        ulica=payload.adres_ulica,
        nr_domu=payload.adres_nr_domu,
        nr_mieszkania=payload.adres_nr_mieszkania,
        miasto=payload.adres_miasto,
        kod_pocztowy=payload.adres_kod_pocztowy,
        typ_zameldowania=payload.adres_typ_zameldowania,
        data_zameldowania=payload.adres_data_zameldowania,
        is_current=True,
    )
    session.add(entry)
    log_action(
        session,
        typ_operacji="CREATE",
        opis=f"Zarejestrowano mieszkańca {citizen.imie} {citizen.nazwisko} (PESEL: {citizen.pesel})",
        obywatel_id=citizen.id,
        dane_po=_citizen_snapshot(citizen),
    )
    session.commit()
    session.refresh(citizen)

    return _build_citizen_read(citizen, session)


@router.get("/{citizen_id}", response_model=CitizenRead)
def get_citizen(citizen_id: int, session: Session = Depends(get_session)):
    citizen = session.get(Citizen, citizen_id)
    if not citizen:
        raise HTTPException(status_code=404, detail="Nie znaleziono mieszkańca")
    log_action(
        session,
        typ_operacji="VIEW",
        opis=f"Wyświetlono kartotekę {citizen.imie} {citizen.nazwisko} (PESEL: {citizen.pesel})",
        obywatel_id=citizen_id,
    )
    session.commit()
    return _build_citizen_read(citizen, session)


@router.put("/{citizen_id}", response_model=CitizenRead)
def update_citizen(
    citizen_id: int,
    payload: CitizenUpdate,
    session: Session = Depends(get_session),
):
    citizen = session.get(Citizen, citizen_id)
    if not citizen:
        raise HTTPException(status_code=404, detail="Nie znaleziono mieszkańca")

    snapshot_before = _citizen_snapshot(citizen)
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(citizen, field, value)

    log_action(
        session,
        typ_operacji="UPDATE",
        opis=f"Zaktualizowano dane mieszkańca {citizen.imie} {citizen.nazwisko} (PESEL: {citizen.pesel})",
        obywatel_id=citizen_id,
        dane_przed=snapshot_before,
        dane_po=_citizen_snapshot(citizen),
    )
    session.add(citizen)
    session.commit()
    session.refresh(citizen)

    return _build_citizen_read(citizen, session)


@router.delete("/{citizen_id}", status_code=204)
def delete_citizen(citizen_id: int, session: Session = Depends(get_session)):
    citizen = session.get(Citizen, citizen_id)
    if not citizen:
        raise HTTPException(status_code=404, detail="Nie znaleziono mieszkańca")

    snapshot_before = _citizen_snapshot(citizen)

    # Delete all linked records first
    for entry in session.exec(
        select(RegistrationEntry).where(RegistrationEntry.obywatel_id == citizen_id)
    ).all():
        session.delete(entry)

    from app.models import IdentityDocument, AuditLog
    for doc in session.exec(
        select(IdentityDocument).where(IdentityDocument.obywatel_id == citizen_id)
    ).all():
        session.delete(doc)

    for log in session.exec(
        select(AuditLog).where(AuditLog.obywatel_id == citizen_id)
    ).all():
        session.delete(log)

    log_action(
        session,
        typ_operacji="DELETE",
        opis=f"Usunięto mieszkańca {citizen.imie} {citizen.nazwisko} (PESEL: {citizen.pesel})",
        dane_przed=snapshot_before,
    )
    session.delete(citizen)
    session.commit()
