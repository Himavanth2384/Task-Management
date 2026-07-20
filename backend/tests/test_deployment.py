import pytest

from app import create_app


def test_serves_frontend_index_for_spa_routes(tmp_path, monkeypatch):
    dist_dir = tmp_path / "dist"
    dist_dir.mkdir()
    (dist_dir / "index.html").write_text("<html>spa-ready</html>", encoding="utf-8")

    monkeypatch.setenv("FRONTEND_DIST_PATH", str(dist_dir))

    app = create_app()
    client = app.test_client()

    response = client.get("/tasks/123")

    assert response.status_code == 200
    assert b"spa-ready" in response.data
