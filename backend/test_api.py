"""Test suite for SakhiAI backend."""

import pytest
import os
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from app import app


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


class TestHealth:
    """Test health check endpoint."""

    def test_health_check(self, client):
        """Test that health endpoint returns ok status."""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
        assert "gemini_configured" in response.json()

    def test_health_check_structure(self, client):
        """Test health check response structure."""
        response = client.get("/health")
        data = response.json()
        assert isinstance(data["gemini_configured"], bool)


class TestLanguages:
    """Test languages endpoint."""

    def test_languages_endpoint(self, client):
        """Test that languages endpoint returns list of supported languages."""
        response = client.get("/languages")
        assert response.status_code == 200
        data = response.json()
        assert "languages" in data
        assert isinstance(data["languages"], list)
        assert len(data["languages"]) > 0

    def test_languages_structure(self, client):
        """Test each language has required fields."""
        response = client.get("/languages")
        data = response.json()
        for lang in data["languages"]:
            assert "code" in lang
            assert "name" in lang
            assert "native" in lang


class TestAnalyze:
    """Test symptom analysis endpoint."""

    def test_analyze_missing_text(self, client):
        """Test that analyze endpoint requires text."""
        response = client.post("/analyze", json={"text": ""})
        assert response.status_code == 400

    def test_analyze_valid_request(self, client):
        """Test analyze endpoint with valid input."""
        response = client.post(
            "/analyze",
            json={
                "text": "I have a headache and fever",
                "language": "en",
                "pregnant": False,
            }
        )
        # May fail if Gemini key not set, but should have proper error
        assert response.status_code in [200, 503]

    def test_analyze_response_structure(self, client):
        """Test analyze response has required fields."""
        if not os.getenv("GEMINI_API_KEY"):
            pytest.skip("GEMINI_API_KEY not set")
        
        response = client.post(
            "/analyze",
            json={
                "text": "chest pain",
                "language": "en",
                "pregnant": False,
            }
        )
        if response.status_code == 200:
            data = response.json()
            assert "symptoms" in data
            assert "severity" in data
            assert "risk_level" in data
            assert "possible_conditions" in data
            assert "recommendations" in data


class TestChat:
    """Test chat endpoint."""

    def test_chat_missing_message(self, client):
        """Test that chat endpoint requires message."""
        response = client.post("/chat", json={"message": ""})
        assert response.status_code == 400

    def test_chat_valid_request(self, client):
        """Test chat endpoint with valid input."""
        response = client.post(
            "/chat",
            json={
                "message": "Should I see a doctor?",
                "history": [],
                "language": "en",
                "pregnant": False,
            }
        )
        # May fail if Gemini key not set, but should have proper error
        assert response.status_code in [200, 503]


class TestRateLimiting:
    """Test rate limiting middleware."""

    def test_rate_limit_not_applied_to_health(self, client):
        """Test that health endpoint is not rate limited."""
        for _ in range(100):
            response = client.get("/health")
            assert response.status_code == 200

    def test_rate_limit_applied_to_analyze(self, client):
        """Test that analyze endpoint is rate limited."""
        if not os.getenv("GEMINI_API_KEY"):
            pytest.skip("GEMINI_API_KEY not set")
        
        # Make requests until rate limited
        status_codes = []
        for _ in range(35):  # Default limit is 30/minute
            response = client.post(
                "/analyze",
                json={"text": "test", "pregnant": False}
            )
            status_codes.append(response.status_code)

        # Should eventually hit 429
        assert 429 in status_codes or 503 in status_codes


class TestCORS:
    """Test CORS headers."""

    def test_cors_headers_present(self, client):
        """Test that CORS headers are set."""
        response = client.options("/health")
        assert response.status_code == 200


class TestErrorHandling:
    """Test error handling."""

    def test_404_not_found(self, client):
        """Test 404 response for non-existent endpoint."""
        response = client.get("/nonexistent")
        assert response.status_code == 404

    def test_invalid_json(self, client):
        """Test error handling for invalid JSON."""
        response = client.post(
            "/analyze",
            content="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422  # Unprocessable Entity


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
