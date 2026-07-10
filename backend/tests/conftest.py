"""
Pytest fixtures — shared test infrastructure.
"""

import pytest
from app import create_app
from app.config import TestingConfig
from app.extensions import db as _db


@pytest.fixture(scope="session")
def app():
    """Create a Flask application configured for testing (in-memory DB)."""
    application = create_app(TestingConfig)
    return application


@pytest.fixture(scope="session")
def client(app):
    """Flask test client."""
    return app.test_client()


@pytest.fixture(scope="function", autouse=True)
def reset_db(app):
    """
    Reset the database before each test function.
    Creates all tables fresh and drops them after each test.
    """
    with app.app_context():
        _db.create_all()
        yield
        _db.session.remove()
        _db.drop_all()


@pytest.fixture
def registered_user(client):
    """Register a test user and return the response data."""
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "password123",
        },
        content_type="application/json",
    )
    return response.get_json()


@pytest.fixture
def auth_headers(registered_user):
    """Return Authorization headers using the test user's JWT token."""
    token = registered_user["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}
