"""Configuration for pytest."""

import os
import pytest


@pytest.fixture(scope="session")
def test_env():
    """Set test environment variables."""
    os.environ.setdefault("TESTING", "true")
    os.environ.setdefault("RATE_LIMIT_PER_MINUTE", "100")  # Higher limit for tests
    return os.environ


def pytest_configure(config):
    """Pytest configuration hook."""
    os.environ["TESTING"] = "true"
