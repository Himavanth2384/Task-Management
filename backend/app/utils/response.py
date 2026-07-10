"""
Standardized JSON response helpers.
All API endpoints use these to ensure consistent response structure.
"""

from flask import jsonify


def success_response(message: str, data=None, status_code: int = 200):
    """
    Build a standard success JSON response.

    :param message: Human-readable success message.
    :param data: Optional payload (dict, list, etc.).
    :param status_code: HTTP status code (default 200).
    :return: Flask Response tuple.
    """
    response = {
        "success": True,
        "message": message,
        "data": data if data is not None else {},
    }
    return jsonify(response), status_code


def error_response(message: str, status_code: int = 400, errors=None):
    """
    Build a standard error JSON response.

    :param message: Human-readable error message.
    :param status_code: HTTP status code (default 400).
    :param errors: Optional dict of field-level validation errors.
    :return: Flask Response tuple.
    """
    response = {
        "success": False,
        "message": message,
        "errors": errors if errors is not None else {},
    }
    return jsonify(response), status_code
