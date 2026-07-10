"""
Authentication routes — Registration, Login, and Profile endpoints.

Endpoints:
  POST /api/auth/register  — Create a new user account
  POST /api/auth/login     — Authenticate and get JWT token
  GET  /api/auth/profile   — Get the authenticated user's profile (protected)
"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from ..services.auth_service import AuthService
from ..utils.response import success_response, error_response

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new user.

    Request Body:
        { "name": str, "email": str, "password": str }

    Returns:
        201: { success, message, data: { user, access_token } }
        400: Validation errors or duplicate email.
    """
    data = request.get_json(silent=True)
    if not data:
        return error_response("Request body must be valid JSON.", 400)

    try:
        result = AuthService.register(data)
        return success_response("Registration successful. Welcome!", result, 201)
    except ValidationError as e:
        return error_response("Validation failed.", 400, e.messages)
    except ValueError as e:
        return error_response(str(e), 409)
    except Exception as e:
        return error_response("An unexpected error occurred.", 500)


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticate a user and return a JWT token.

    Request Body:
        { "email": str, "password": str }

    Returns:
        200: { success, message, data: { user, access_token } }
        400: Validation errors.
        401: Invalid credentials.
    """
    data = request.get_json(silent=True)
    if not data:
        return error_response("Request body must be valid JSON.", 400)

    try:
        result = AuthService.login(data)
        return success_response("Login successful.", result, 200)
    except ValidationError as e:
        return error_response("Validation failed.", 400, e.messages)
    except ValueError as e:
        return error_response(str(e), 401)
    except Exception as e:
        return error_response("An unexpected error occurred.", 500)


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    """
    Get the authenticated user's profile.
    Requires: Authorization: Bearer <token>

    Returns:
        200: { success, message, data: { user } }
        401: If token is missing or invalid.
        404: If user account is not found.
    """
    try:
        user_id = int(get_jwt_identity())
        user_data = AuthService.get_profile(user_id)
        return success_response("Profile retrieved successfully.", {"user": user_data})
    except LookupError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response("An unexpected error occurred.", 500)
