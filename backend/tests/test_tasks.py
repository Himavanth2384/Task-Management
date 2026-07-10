"""
Unit tests for task CRUD endpoints.
Tests: create, read, update, delete, ownership enforcement, filtering, stats.
"""


def _create_task(client, headers, **overrides):
    """Helper to create a task with default values."""
    payload = {
        "title": "Sample Task",
        "description": "A test task",
        "status": "Pending",
        "priority": "Medium",
        "category": "Work",
        "due_date": "2026-12-31",
        **overrides,
    }
    return client.post("/api/tasks", json=payload, headers=headers)


class TestCreateTask:
    """Tests for POST /api/tasks."""

    def test_create_task_success(self, client, auth_headers):
        res = _create_task(client, auth_headers)
        data = res.get_json()
        assert res.status_code == 201
        assert data["success"] is True
        assert data["data"]["task"]["title"] == "Sample Task"

    def test_create_task_without_auth(self, client):
        res = client.post("/api/tasks", json={"title": "Unauthorized"})
        assert res.status_code == 401

    def test_create_task_missing_title(self, client, auth_headers):
        res = client.post("/api/tasks", json={"priority": "High"}, headers=auth_headers)
        assert res.status_code == 400
        assert "title" in res.get_json()["errors"]

    def test_create_task_invalid_status(self, client, auth_headers):
        res = _create_task(client, auth_headers, status="InvalidStatus")
        assert res.status_code == 400

    def test_create_task_invalid_priority(self, client, auth_headers):
        res = _create_task(client, auth_headers, priority="Ultra")
        assert res.status_code == 400


class TestReadTasks:
    """Tests for GET /api/tasks and GET /api/tasks/<id>."""

    def test_get_tasks_empty(self, client, auth_headers):
        res = client.get("/api/tasks", headers=auth_headers)
        data = res.get_json()
        assert res.status_code == 200
        assert data["data"]["tasks"] == []

    def test_get_tasks_with_data(self, client, auth_headers):
        _create_task(client, auth_headers, title="Task One")
        _create_task(client, auth_headers, title="Task Two")
        res = client.get("/api/tasks", headers=auth_headers)
        data = res.get_json()
        assert res.status_code == 200
        assert len(data["data"]["tasks"]) == 2

    def test_get_single_task(self, client, auth_headers):
        create_res = _create_task(client, auth_headers)
        task_id = create_res.get_json()["data"]["task"]["id"]
        res = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
        assert res.status_code == 200
        assert res.get_json()["data"]["task"]["id"] == task_id

    def test_get_nonexistent_task(self, client, auth_headers):
        res = client.get("/api/tasks/9999", headers=auth_headers)
        assert res.status_code == 404

    def test_filter_by_status(self, client, auth_headers):
        _create_task(client, auth_headers, status="Completed")
        _create_task(client, auth_headers, status="Pending")
        res = client.get("/api/tasks?status=Completed", headers=auth_headers)
        tasks = res.get_json()["data"]["tasks"]
        assert all(t["status"] == "Completed" for t in tasks)

    def test_filter_by_priority(self, client, auth_headers):
        _create_task(client, auth_headers, priority="High")
        _create_task(client, auth_headers, priority="Low")
        res = client.get("/api/tasks?priority=High", headers=auth_headers)
        tasks = res.get_json()["data"]["tasks"]
        assert all(t["priority"] == "High" for t in tasks)

    def test_search_by_title(self, client, auth_headers):
        _create_task(client, auth_headers, title="Buy groceries")
        _create_task(client, auth_headers, title="Write report")
        res = client.get("/api/tasks?search=groceries", headers=auth_headers)
        tasks = res.get_json()["data"]["tasks"]
        assert len(tasks) == 1
        assert "groceries" in tasks[0]["title"].lower()

    def test_pagination(self, client, auth_headers):
        for i in range(15):
            _create_task(client, auth_headers, title=f"Task {i}")
        res = client.get("/api/tasks?page=1&limit=5", headers=auth_headers)
        data = res.get_json()["data"]
        assert len(data["tasks"]) == 5
        assert data["pagination"]["total"] == 15


class TestUpdateTask:
    """Tests for PUT /api/tasks/<id>."""

    def test_update_task_success(self, client, auth_headers):
        create_res = _create_task(client, auth_headers)
        task_id = create_res.get_json()["data"]["task"]["id"]
        res = client.put(
            f"/api/tasks/{task_id}",
            json={"status": "Completed", "priority": "High"},
            headers=auth_headers,
        )
        data = res.get_json()
        assert res.status_code == 200
        assert data["data"]["task"]["status"] == "Completed"
        assert data["data"]["task"]["priority"] == "High"

    def test_update_nonexistent_task(self, client, auth_headers):
        res = client.put("/api/tasks/9999", json={"title": "X"}, headers=auth_headers)
        assert res.status_code == 404

    def test_update_another_users_task(self, client, auth_headers):
        # Create task as user 1
        task_id = _create_task(client, auth_headers).get_json()["data"]["task"]["id"]

        # Register user 2
        client.post(
            "/api/auth/register",
            json={"name": "User2", "email": "user2@example.com", "password": "password123"},
        )
        login_res = client.post(
            "/api/auth/login",
            json={"email": "user2@example.com", "password": "password123"},
        )
        user2_token = login_res.get_json()["data"]["access_token"]
        user2_headers = {"Authorization": f"Bearer {user2_token}"}

        # User 2 tries to update user 1's task
        res = client.put(f"/api/tasks/{task_id}", json={"title": "Hacked"}, headers=user2_headers)
        assert res.status_code == 403


class TestDeleteTask:
    """Tests for DELETE /api/tasks/<id>."""

    def test_delete_task_success(self, client, auth_headers):
        task_id = _create_task(client, auth_headers).get_json()["data"]["task"]["id"]
        res = client.delete(f"/api/tasks/{task_id}", headers=auth_headers)
        assert res.status_code == 200
        # Verify it's gone
        get_res = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
        assert get_res.status_code == 404

    def test_delete_nonexistent_task(self, client, auth_headers):
        res = client.delete("/api/tasks/9999", headers=auth_headers)
        assert res.status_code == 404

    def test_delete_another_users_task(self, client, auth_headers):
        task_id = _create_task(client, auth_headers).get_json()["data"]["task"]["id"]

        client.post(
            "/api/auth/register",
            json={"name": "Intruder", "email": "intruder@example.com", "password": "password123"},
        )
        login_res = client.post(
            "/api/auth/login",
            json={"email": "intruder@example.com", "password": "password123"},
        )
        intruder_token = login_res.get_json()["data"]["access_token"]
        intruder_headers = {"Authorization": f"Bearer {intruder_token}"}

        res = client.delete(f"/api/tasks/{task_id}", headers=intruder_headers)
        assert res.status_code == 403


class TestDashboardStats:
    """Tests for GET /api/tasks/stats."""

    def test_stats_empty(self, client, auth_headers):
        res = client.get("/api/tasks/stats", headers=auth_headers)
        data = res.get_json()["data"]
        assert res.status_code == 200
        assert data["total"] == 0

    def test_stats_with_tasks(self, client, auth_headers):
        _create_task(client, auth_headers, status="Pending", priority="High")
        _create_task(client, auth_headers, status="Completed", priority="Low")
        _create_task(client, auth_headers, status="In Progress", priority="High")
        res = client.get("/api/tasks/stats", headers=auth_headers)
        data = res.get_json()["data"]
        assert data["total"] == 3
        assert data["pending"] == 1
        assert data["completed"] == 1
        assert data["in_progress"] == 1
        assert data["high_priority"] == 2
