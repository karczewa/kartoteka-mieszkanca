from datetime import date
from typing import Literal


# PESEL checksum weights per position (0–9)
_WEIGHTS = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]


def _checksum_valid(pesel: str) -> bool:
    total = sum(int(pesel[i]) * _WEIGHTS[i] for i in range(10))
    return (10 - (total % 10)) % 10 == int(pesel[10])


def _extract_birth_date(pesel: str) -> date:
    year = int(pesel[0:2])
    month = int(pesel[2:4])
    day = int(pesel[4:6])

    # Encoding century in the month field:
    # 01-12  → 1900s
    # 21-32  → 2000s
    # 41-52  → 2100s
    # 61-72  → 2200s
    # 81-92  → 1800s
    if 1 <= month <= 12:
        year += 1900
    elif 21 <= month <= 32:
        year += 2000
        month -= 20
    elif 41 <= month <= 52:
        year += 2100
        month -= 40
    elif 61 <= month <= 72:
        year += 2200
        month -= 60
    elif 81 <= month <= 92:
        year += 1800
        month -= 80
    else:
        raise ValueError(f"Nieprawidłowy miesiąc w numerze PESEL: {month}")

    return date(year, month, day)


def _extract_sex(pesel: str) -> Literal["M", "K"]:
    # 10th digit (index 9): odd → male, even → female
    return "M" if int(pesel[9]) % 2 == 1 else "K"


def validate_pesel(pesel: str) -> None:
    """
    Raises ValueError with a Polish message if PESEL is invalid.
    Does nothing if valid.
    """
    if not pesel.isdigit() or len(pesel) != 11:
        raise ValueError("PESEL musi składać się z 11 cyfr")
    if not _checksum_valid(pesel):
        raise ValueError("Nieprawidłowa suma kontrolna numeru PESEL")


def parse_pesel(pesel: str) -> tuple[date, Literal["M", "K"]]:
    """
    Validates PESEL and returns (data_urodzenia, plec).
    Raises ValueError if invalid.
    """
    validate_pesel(pesel)
    return _extract_birth_date(pesel), _extract_sex(pesel)
