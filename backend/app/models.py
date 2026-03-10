from datetime import date, datetime
from typing import ClassVar, List, Optional
import sqlalchemy as sa
from sqlmodel import Field, Relationship, SQLModel


class Citizen(SQLModel, table=True):
    __tablename__: ClassVar[str] = "citizens"
    __table_args__: ClassVar[tuple] = (
        sa.CheckConstraint("plec IN ('M', 'K')", name="ck_citizens_plec"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    pesel: str = Field(unique=True, index=True, max_length=11)
    imie: str = Field(max_length=100)
    nazwisko: str = Field(max_length=100)
    data_urodzenia: date
    plec: str = Field(max_length=1)  # 'M' or 'K'

    # Contact (optional)
    telefon: Optional[str] = Field(default=None, max_length=20)
    email: Optional[str] = Field(default=None, max_length=200)

    # Correspondence address (optional, separate from registered address)
    koresp_ulica: Optional[str] = Field(default=None, max_length=200)
    koresp_nr_domu: Optional[str] = Field(default=None, max_length=20)
    koresp_nr_mieszkania: Optional[str] = Field(default=None, max_length=20)
    koresp_miasto: Optional[str] = Field(default=None, max_length=100)
    koresp_kod_pocztowy: Optional[str] = Field(default=None, max_length=10)

    dokumenty: List["IdentityDocument"] = Relationship(back_populates="obywatel")
    historia_zameldowania: List["RegistrationEntry"] = Relationship(back_populates="obywatel")


class IdentityDocument(SQLModel, table=True):
    __tablename__: ClassVar[str] = "identity_documents"
    __table_args__: ClassVar[tuple] = (
        sa.CheckConstraint("typ IN ('dowod', 'paszport')", name="ck_identity_documents_typ"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    obywatel_id: int = Field(foreign_key="citizens.id")
    typ: str = Field(max_length=20)        # 'dowod' or 'paszport'
    seria: str = Field(max_length=10)      # letters only (A-Z)
    numer: str = Field(max_length=20)      # digits only (0-9)
    data_wydania: date
    data_waznosci: date
    organ_wydajacy: str = Field(max_length=200)
    is_active: bool = Field(default=False)

    obywatel: Optional[Citizen] = Relationship(back_populates="dokumenty")


class RegistrationEntry(SQLModel, table=True):
    __tablename__: ClassVar[str] = "registration_entries"
    __table_args__: ClassVar[tuple] = (
        sa.CheckConstraint("typ_zameldowania IN ('stale', 'tymczasowe')", name="ck_registration_entries_typ"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    obywatel_id: int = Field(foreign_key="citizens.id")
    ulica: str = Field(max_length=200)
    nr_domu: str = Field(max_length=20)
    nr_mieszkania: Optional[str] = Field(default=None, max_length=20)
    miasto: str = Field(max_length=100)
    kod_pocztowy: str = Field(max_length=10)
    typ_zameldowania: str = Field(max_length=20)  # 'stale' or 'tymczasowe'
    data_zameldowania: date
    is_current: bool = Field(default=False)

    obywatel: Optional[Citizen] = Relationship(back_populates="historia_zameldowania")


class AuditLog(SQLModel, table=True):
    __tablename__: ClassVar[str] = "audit_log"
    __table_args__: ClassVar[tuple] = (
        sa.CheckConstraint("typ_operacji IN ('CREATE', 'UPDATE', 'DELETE', 'VIEW')", name="ck_audit_log_typ_operacji"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    typ_operacji: str = Field(max_length=20)  # 'CREATE', 'UPDATE', 'DELETE', 'VIEW'
    opis: str = Field(max_length=500)
    obywatel_id: Optional[int] = Field(default=None, foreign_key="citizens.id")
    dane_przed: Optional[str] = Field(default=None, sa_column=sa.Column(sa.JSON, nullable=True))  # snapshot before change
    dane_po: Optional[str] = Field(default=None, sa_column=sa.Column(sa.JSON, nullable=True))     # snapshot after change
