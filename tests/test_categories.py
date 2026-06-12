def test_create_category(client, auth_headers):
    resp = client.post("/api/categories/", json={"name": "Food", "color": "#22c55e"}, headers=auth_headers)
    assert resp.status_code == 201
    assert resp.json()["name"] == "Food"


def test_list_categories(client, auth_headers):
    client.post("/api/categories/", json={"name": "Transport"}, headers=auth_headers)
    resp = client.get("/api/categories/", headers=auth_headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_duplicate_category(client, auth_headers):
    client.post("/api/categories/", json={"name": "DupCat"}, headers=auth_headers)
    resp = client.post("/api/categories/", json={"name": "DupCat"}, headers=auth_headers)
    assert resp.status_code == 400


def test_delete_category(client, auth_headers):
    created = client.post("/api/categories/", json={"name": "ToDelete"}, headers=auth_headers).json()
    resp = client.delete(f"/api/categories/{created['id']}", headers=auth_headers)
    assert resp.status_code == 204
