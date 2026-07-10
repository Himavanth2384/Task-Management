"""
Marshmallow schema for the User model.
Handles serialization, deserialization, and validation of user data.
"""

from marshmallow import Schema, fields, validate, validates, ValidationError, pre_load


class UserRegistrationSchema(Schema):
    """Schema for validating user registration input."""

    name = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=120, error="Name must be between 2 and 120 characters."),
    )
    email = fields.Email(required=True, error_messages={"invalid": "Enter a valid email address."})
    password = fields.Str(
        required=True,
        load_only=True,  # Never serialize passwords
        validate=validate.Length(min=8, error="Password must be at least 8 characters long."),
    )

    @pre_load
    def strip_strings(self, data, **kwargs):
        """Strip whitespace from string fields before validation."""
        for key in ("name", "email"):
            if key in data and isinstance(data[key], str):
                data[key] = data[key].strip()
        return data


class UserLoginSchema(Schema):
    """Schema for validating user login input."""

    email = fields.Email(required=True, error_messages={"invalid": "Enter a valid email address."})
    password = fields.Str(required=True, load_only=True)


class UserOutputSchema(Schema):
    """Schema for serializing user data (safe for API output)."""

    id = fields.Int(dump_only=True)
    name = fields.Str()
    email = fields.Email()
    created_at = fields.DateTime(dump_only=True)


# Reusable schema instances
user_registration_schema = UserRegistrationSchema()
user_login_schema = UserLoginSchema()
user_output_schema = UserOutputSchema()
