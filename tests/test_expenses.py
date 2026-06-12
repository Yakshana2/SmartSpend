import pytest
from datetime import datetime


SAMPLE = {
    "title": "Coffee",
    "amount": 4.50,
    "date": "2024-06-01T09:00:00",
    "description": "Morning coffee",
}


def test_create_expense(client, auth_headers):
    resp = client.post("/api/expenses/", json=SAMPLE, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Coffee"
    assert data["amount"] == 4.50
    assert "id" in data


def test_list_expenses(client, auth_headers):
    client.post("/api/expenses/", json=SAMPLE, headers=auth_headers)
    resp = client.get("/api/expenses/", headers=auth_headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    assert len(resp.json()) >= 1


def test_get_expense_by_id(client, auth_headers):
    created = client.post("/api/expenses/", json=SAMPLE, headers=auth_headers).json()
    resp = client.get(f"/api/expenses/{created['id']}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["id"] == created["id"]


def test_update_expense(client, auth_headers):
    created = client.post("/api/expenses/", json=SAMPLE, headers=auth_headers).json()
    resp = client.put(
        f"/api/expenses/{created['id']}",
        json={"title": "Updated Coffee", "amount": 5.00},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["title"] == "Updated Coffee"
    assert resp.json()["amount"] == 5.00


def test_delete_expense(client, auth_headers):
    created = client.post("/api/expenses/", json=SAMPLE, headers=auth_headers).json()
    resp = client.delete(f"/api/expenses/{created['id']}", headers=auth_headers)
    assert resp.status_code == 204
    # Confirm it's gone
    get_resp = client.get(f"/api/expenses/{created['id']}", headers=auth_headers)
    assert get_resp.status_code == 404


def test_expense_not_found(client, auth_headers):
    resp = client.get("/api/expenses/99999", headers=auth_headers)
    assert resp.status_code == 404


def test_summary(client, auth_headers):
    client.post("/api/expenses/", json=SAMPLE, headers=auth_headers)
    resp = client.get("/api/expenses/summary", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total" in data
    assert "count" in data
    assert "by_category" in data
