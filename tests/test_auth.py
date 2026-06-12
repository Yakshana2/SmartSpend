import pytest


def test_register_success(client):
    resp = client.post("/api/auth/register", json={
        "email": "newuser@example.com",
        "password": "securepassword",
        "full_name": "New User",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    payload = {"email": "dup@example.com", "password": "pass1234"}
    client.post("/api/auth/register", json=payload)
    resp = client.post("/api/auth/register", json=payload)
    assert resp.status_code == 400


def test_login_success(client):
    client.post("/api/auth/register", json={"email": "login@example.com", "password": "pass1234"})
    resp = client.post("/api/auth/login", json={"email": "login@example.com", "password": "pass1234"})
    assert resp.status_code == 200
    assert "access_token" in resp.json()
    assert resp.json()["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={"email": "pw@example.com", "password": "correctpass"})
    resp = client.post("/api/auth/login", json={"email": "pw@example.com", "password": "wrongpass"})
    assert resp.status_code == 401


def test_protected_route_without_token(client):
    resp = client.get("/api/expenses/")
    assert resp.status_code == 401
