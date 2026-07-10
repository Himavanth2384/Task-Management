"""
Input validation utility functions.
Used by services and routes for clean pre-processing validation.
"""

import re
from datetime import datetime


def is_valid_email(email: str) -> bool:
    """
    Validate email format using a standard regex pattern.

    :param email: Email string to validate.
    :return: True if valid, False otherwise.
    """
    pattern = r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))


def is_valid_password(password: str, min_length: int = 8) -> bool:
    """
    Validate that the password meets the minimum length requirement.

    :param password: Password string to validate.
    :param min_length: Minimum required length (default 8).
    :return: True if valid, False otherwise.
    """
    return len(password) >= min_length


def is_valid_date(date_str: str) -> bool:
    """
    Validate that the date string is in YYYY-MM-DD format.

    :param date_str: Date string to validate.
    :return: True if valid, False otherwise.
    """
    if not date_str:
        return True  # Optional field — None is acceptable
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False


def validate_required_fields(data: dict, required_fields: list) -> dict:
    """
    Check that all required fields are present and non-empty.

    :param data: Request data dictionary.
    :param required_fields: List of field names that must be present.
    :return: Dict of {field: error_message} for any missing/empty fields.
    """
    errors = {}
    for field in required_fields:
        value = data.get(field)
        if value is None or (isinstance(value, str) and not value.strip()):
            errors[field] = f"{field.replace('_', ' ').capitalize()} is required."
    return errors
