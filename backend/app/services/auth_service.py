"""
Authentication service — business logic for user registration, login, and profile.
Keeps route handlers thin by centralizing all auth logic here.
"""

from marshmallow import ValidationError
from flask_jwt_extended import create_access_token

from ..extensions import db
from ..models.user import User
from ..schemas.user_schema import (
    user_registration_schema,
    user_login_schema,
    user_output_schema,
)


class AuthService:
    """Handles all authentication-related operations."""

    @staticmethod
    def register(data: dict) -> dict:
        """
        Register a new user.

        :param data: Raw request JSON.
        :return: Dict with user data and JWT token.
        :raises ValidationError: If input validation fails.
        :raises ValueError: If email is already taken.
        """
        # Validate and deserialize input
        validated = user_registration_schema.load(data)

        # Check for duplicate email (case-insensitive)
        email_lower = validated["email"].lower()
        if User.query.filter_by(email=email_lower).first():
            raise ValueError("An account with this email already exists.")

        # Create and persist the user
        user = User(name=validated["name"], email=email_lower)
        user.set_password(validated["password"])
        db.session.add(user)
        db.session.commit()

        # Issue JWT token
        access_token = create_access_token(identity=str(user.id))

        return {
            "user": user_output_schema.dump(user),
            "access_token": access_token,
        }

    @staticmethod
    def login(data: dict) -> dict:
        """
        Authenticate user and return JWT token.

        :param data: Raw request JSON with email and password.
        :return: Dict with user data and JWT token.
        :raises ValidationError: If input is invalid.
        :raises ValueError: If credentials are wrong.
        """
        validated = user_login_schema.load(data)

        user = User.query.filter_by(email=validated["email"].lower()).first()
        if not user or not user.check_password(validated["password"]):
            raise ValueError("Invalid email or password.")

        access_token = create_access_token(identity=str(user.id))

        return {
            "user": user_output_schema.dump(user),
            "access_token": access_token,
        }

    @staticmethod
    def get_profile(user_id: int) -> dict:
        """
        Fetch the authenticated user's profile.

        :param user_id: ID of the authenticated user.
        :return: Serialized user data.
        :raises LookupError: If user not found.
        """
        user = db.session.get(User, user_id)
        if not user:
            raise LookupError("User not found.")
        return user_output_schema.dump(user)
