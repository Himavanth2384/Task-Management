"""
Unit tests for authentication endpoints.
Tests: registration, login, JWT, profile, protected routes.
"""


class TestRegistration:
    """Tests for POST /api/auth/register."""

    def test_successful_registration(self, client):
        res = client.post(
            "/api/auth/register",
            json={"name": "Alice", "email": "alice@example.com", "password": "securepass"},
        )
        data = res.get_json()
        assert res.status_code == 201
        assert data["success"] is True
        assert "access_token" in data["data"]
        assert data["data"]["user"]["email"] == "alice@example.com"

    def test_duplicate_email_rejected(self, client):
        payload = {"name": "Bob", "email": "bob@example.com", "password": "securepass"}
        client.post("/api/auth/register", json=payload)
        res = client.post("/api/auth/register", json=payload)
        assert res.status_code == 409
        assert res.get_json()["success"] is False

    def test_missing_name(self, client):
        res = client.post(
            "/api/auth/register",
            json={"email": "nname@example.com", "password": "securepass"},
        )
        assert res.status_code == 400
        assert "name" in res.get_json()["errors"]

    def test_invalid_email_format(self, client):
        res = client.post(
            "/api/auth/register",
            json={"name": "Carol", "email": "not-an-email", "password": "securepass"},
        )
        assert res.status_code == 400
        assert "email" in res.get_json()["errors"]

    def test_short_password_rejected(self, client):
        res = client.post(
            "/api/auth/register",
            json={"name": "Dave", "email": "dave@example.com", "password": "short"},
        )
        assert res.status_code == 400
        assert "password" in res.get_json()["errors"]


class TestLogin:
    """Tests for POST /api/auth/login."""

    def test_successful_login(self, client, registered_user):
        res = client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "password123"},
        )
        data = res.get_json()
        assert res.status_code == 200
        assert data["success"] is True
        assert "access_token" in data["data"]

    def test_wrong_password(self, client, registered_user):
        res = client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "wrongpassword"},
        )
        assert res.status_code == 401
        assert res.get_json()["success"] is False

    def test_nonexistent_email(self, client):
        res = client.post(
            "/api/auth/login",
            json={"email": "ghost@example.com", "password": "password123"},
        )
        assert res.status_code == 401

    def test_missing_credentials(self, client):
        res = client.post("/api/auth/login", json={})
        assert res.status_code == 400


class TestProfile:
    """Tests for GET /api/auth/profile."""

    def test_profile_with_valid_token(self, client, registered_user, auth_headers):
        res = client.get("/api/auth/profile", headers=auth_headers)
        data = res.get_json()
        assert res.status_code == 200
        assert data["success"] is True
        assert data["data"]["user"]["email"] == "test@example.com"

    def test_profile_without_token(self, client):
        res = client.get("/api/auth/profile")
        assert res.status_code == 401

    def test_profile_with_invalid_token(self, client):
        res = client.get(
            "/api/auth/profile",
            headers={"Authorization": "Bearer invalid.token.value"},
        )
        assert res.status_code == 401
