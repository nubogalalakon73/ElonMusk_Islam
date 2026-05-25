"""
Backend tests for ELON MUSK x ISLAM API
"""
import os
import re
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://reflection-mirror-1.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ── Health ────────────────────────────────────────────────────────────
class TestHealth:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert data.get("status") == "ok"


# ── Leads ─────────────────────────────────────────────────────────────
class TestLeads:
    def test_create_lead_valid(self, session):
        payload = {
            "name": "TEST_Reader",
            "email": "TEST_reader@example.com",
            "whatsapp": "+628123456789",
            "city": "Jakarta",
            "profession": "Tester",
            "source": "landing",
        }
        r = session.post(f"{API}/leads", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and len(data["id"]) > 0
        assert data["email"] == payload["email"]
        assert "created_at" in data

    def test_create_lead_invalid_email(self, session):
        payload = {
            "name": "TEST_X",
            "email": "not-an-email",
            "whatsapp": "+628111",
        }
        r = session.post(f"{API}/leads", json=payload)
        assert r.status_code == 422

    def test_list_leads(self, session):
        r = session.get(f"{API}/leads")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_export_csv(self, session):
        r = session.get(f"{API}/leads/export")
        assert r.status_code == 200
        assert "text/csv" in r.headers.get("content-type", "")
        assert "id,name,email" in r.text.split("\n")[0]


# ── Orders ────────────────────────────────────────────────────────────
class TestOrders:
    @pytest.fixture(scope="class")
    def order(self, session):
        payload = {
            "name": "TEST_Buyer",
            "email": "TEST_buyer@example.com",
            "whatsapp": "+628999000111",
            "city": "Bandung",
            "product": "FULL_BOOK",
        }
        r = session.post(f"{API}/orders", json=payload)
        assert r.status_code == 200, r.text
        return r.json()

    def test_create_order_auto_paid(self, order):
        assert order["status"] == "paid"
        assert order["order_id"].startswith("EMI-")
        assert order["access_token"]
        assert order["redirect_url"] == f"/success/{order['access_token']}"
        assert order["amount"] == 75000

    def test_get_order_by_token(self, session, order):
        tok = order["access_token"]
        r = session.get(f"{API}/orders/by-token/{tok}")
        assert r.status_code == 200
        data = r.json()
        assert data["order_id"] == order["order_id"]
        assert data["status"] == "paid"
        assert "downloads" in data
        for k in ("pdf", "epub", "flipbook"):
            assert k in data["downloads"]

    def test_get_order_invalid_token(self, session):
        r = session.get(f"{API}/orders/by-token/invalid-xxxxx")
        assert r.status_code == 404

    @pytest.mark.parametrize("kind", ["pdf", "epub", "flipbook"])
    def test_download_kinds(self, session, order, kind):
        tok = order["access_token"]
        r = session.get(f"{API}/download/{kind}/{tok}")
        assert r.status_code == 200
        assert "ELON MUSK" in r.text
        assert kind.upper() in r.text

    def test_download_invalid_token(self, session):
        r = session.get(f"{API}/download/pdf/invalid-xxxxx")
        assert r.status_code == 403


# ── Chat (AI Reflection) ──────────────────────────────────────────────
class TestChat:
    BANNED_TERMS = ["claude", "anthropic", "openai", "gpt"]

    def test_chat_on_topic(self, session):
        sid = f"TEST_session_{int(time.time())}"
        r = session.post(f"{API}/chat", json={
            "session_id": sid,
            "message": "Apa makna paradoks Anto dalam buku ini?",
        }, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        reply = data["reply"].lower()
        # Should NOT reveal Claude/Anthropic
        for t in self.BANNED_TERMS:
            assert t not in reply, f"Reply leaked '{t}': {reply[:300]}"
        # Should mention at least one core narrative metaphor
        keywords = ["anto", "elon", "abdurrahman", "bayangan", "marshmallow", "matahari", "purnama", "gerhana"]
        assert any(k in reply for k in keywords), f"No core narrative keyword found: {reply[:300]}"
        # End of test

    def test_chat_off_topic_gatekeeper(self, session):
        sid = f"TEST_offtopic_{int(time.time())}"
        r = session.post(f"{API}/chat", json={
            "session_id": sid,
            "message": "Bagaimana cara coding React component dengan hooks useState dan useEffect lengkap?",
        }, timeout=60)
        assert r.status_code == 200, r.text
        reply = r.json()["reply"].lower()
        # Must not contain detailed code patterns (the AI may mention the user's terms while redirecting)
        code_patterns = ["const ", "=>", "function(", "```", "{ }", "props.", "import react"]
        leaked = [t for t in code_patterns if t in reply]
        assert not leaked, f"AI gave detailed coding answer (leaked {leaked}): {reply[:400]}"
        # Should redirect with reflective tone
        redirect_hints = ["buku", "pembaca", "kawan", "bayangan", "anto", "elon", "abdurrahman", "matahari", "tema"]
        assert any(h in reply for h in redirect_hints), f"No redirect language detected: {reply[:300]}"

    def test_chat_history(self, session):
        sid = f"TEST_hist_{int(time.time())}"
        r = session.post(f"{API}/chat", json={
            "session_id": sid,
            "message": "Siapa Abdurrahman bin Auf?",
        }, timeout=60)
        assert r.status_code == 200
        # Wait a tiny moment so writes are flushed
        time.sleep(0.5)
        r2 = session.get(f"{API}/chat/{sid}")
        assert r2.status_code == 200
        data = r2.json()
        assert data["session_id"] == sid
        assert len(data["messages"]) >= 2
        roles = [m["role"] for m in data["messages"]]
        assert "user" in roles and "assistant" in roles


# ── Tracking & Stats ──────────────────────────────────────────────────
class TestTrackingStats:
    def test_track_event(self, session):
        r = session.post(f"{API}/track", json={
            "event": "TEST_event",
            "meta": {"page": "landing"},
        })
        assert r.status_code == 200
        assert r.json().get("ok") is True

    def test_stats(self, session):
        r = session.get(f"{API}/stats")
        assert r.status_code == 200
        data = r.json()
        for k in ("leads", "paid_orders", "events"):
            assert k in data
            assert isinstance(data[k], int)
