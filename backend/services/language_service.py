"""Language detection and mapping for 16 Indian languages + English."""

import re
from typing import Optional

SUPPORTED_LANGUAGES: dict[str, dict[str, str]] = {
    "en": {"name": "English", "native": "English", "script_ranges": []},
    "hi": {"name": "Hindi", "native": "हिन्दी", "script_ranges": [(0x0900, 0x097F)]},
    "bn": {"name": "Bengali", "native": "বাংলা", "script_ranges": [(0x0980, 0x09FF)]},
    "ta": {"name": "Tamil", "native": "தமிழ்", "script_ranges": [(0x0B80, 0x0BFF)]},
    "te": {"name": "Telugu", "native": "తెలుగు", "script_ranges": [(0x0C00, 0x0C7F)]},
    "mr": {"name": "Marathi", "native": "मराठी", "script_ranges": [(0x0900, 0x097F)]},
    "gu": {"name": "Gujarati", "native": "ગુજરાતી", "script_ranges": [(0x0A80, 0x0AFF)]},
    "kn": {"name": "Kannada", "native": "ಕನ್ನಡ", "script_ranges": [(0x0C80, 0x0CFF)]},
    "ml": {"name": "Malayalam", "native": "മലയാളം", "script_ranges": [(0x0D00, 0x0D7F)]},
    "pa": {"name": "Punjabi", "native": "ਪੰਜਾਬੀ", "script_ranges": [(0x0A00, 0x0A7F)]},
    "or": {"name": "Odia", "native": "ଓଡ଼ିଆ", "script_ranges": [(0x0B00, 0x0B7F)]},
    "ur": {"name": "Urdu", "native": "اردو", "script_ranges": [(0x0600, 0x06FF), (0x0750, 0x077F)]},
    "as": {"name": "Assamese", "native": "অসমীয়া", "script_ranges": [(0x0980, 0x09FF)]},
    "kok": {"name": "Konkani", "native": "कोंकणी", "script_ranges": [(0x0900, 0x097F)]},
    "mni": {"name": "Manipuri", "native": "মৈতৈলোন্", "script_ranges": [(0xABC0, 0xABFF), (0x0980, 0x09FF)]},
    "sa": {"name": "Sanskrit", "native": "संस्कृतम्", "script_ranges": [(0x0900, 0x097F)]},
}

# Keyword hints for Devanagari-shared languages (best-effort when script alone is ambiguous)
DEVANAGARI_HINTS: dict[str, list[str]] = {
    "hi": ["है", "हूं", "मुझे", "दर्द", "बुखार", "क्या"],
    "mr": ["आहे", "मला", "दुखते", "ताप"],
    "kok": ["म्हाका", "कitan", "dard"],
    "sa": ["अहं", "दुःख", "ज्वर"],
}

DEFAULT_LANGUAGE = "en"


def normalize_language_code(code: Optional[str]) -> Optional[str]:
    if not code or code.lower() in ("auto", "detect", ""):
        return None
    code = code.lower().strip()
    if code == "or":
        return "or"
    if code in SUPPORTED_LANGUAGES:
        return code
    return None


def detect_language(text: str, preferred: Optional[str] = None) -> str:
    """Detect language from text; use preferred if valid; fallback to English."""
    normalized = normalize_language_code(preferred)
    if normalized:
        return normalized

    if not text or not text.strip():
        return DEFAULT_LANGUAGE

    # ASCII-heavy → English
    ascii_ratio = sum(1 for c in text if ord(c) < 128) / max(len(text), 1)
    if ascii_ratio > 0.85:
        return "en"

    scores: dict[str, int] = {}
    for code, info in SUPPORTED_LANGUAGES.items():
        count = 0
        for start, end in info["script_ranges"]:
            for char in text:
                if start <= ord(char) <= end:
                    count += 1
        if count > 0:
            scores[code] = count

    if not scores:
        return DEFAULT_LANGUAGE

    best = max(scores, key=scores.get)

    # Disambiguate Devanagari
    if best in ("hi", "mr", "kok", "sa") and best == "hi":
        for lang, hints in DEVANAGARI_HINTS.items():
            if any(h in text for h in hints):
                return lang

    return best


def get_language_name(code: str) -> str:
    info = SUPPORTED_LANGUAGES.get(code, SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE])
    return info["name"]


def get_native_name(code: str) -> str:
    info = SUPPORTED_LANGUAGES.get(code, SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE])
    return info["native"]


def list_supported() -> list[dict[str, str]]:
    return [
        {"code": code, "name": info["name"], "native": info["native"]}
        for code, info in SUPPORTED_LANGUAGES.items()
    ]


def sanitize_input(text: str, max_length: int = 5000) -> str:
    """Basic input sanitization."""
    text = text.strip()
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", text)
    return text[:max_length]
