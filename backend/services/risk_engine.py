"""Hybrid risk engine: Gemini analysis + rule-based emergency detection."""

import re
from typing import Any

EMERGENCY_KEYWORDS: list[tuple[str, list[str]]] = [
    ("heavy bleeding", ["heavy bleeding", "severe bleeding", "profuse bleeding", "blood loss"]),
    ("severe abdominal pain", ["severe abdominal pain", "intense stomach pain", "excruciating abdominal"]),
    ("loss of consciousness", ["loss of consciousness", "unconscious", "passed out", "fainted and won't wake"]),
    ("difficulty breathing", ["difficulty breathing", "can't breathe", "shortness of breath severe", "gasping"]),
    ("pregnancy bleeding", ["pregnancy bleeding", "bleeding during pregnancy", "pregnant and bleeding", "spotting while pregnant"]),
    ("chest pain", ["chest pain", "crushing chest", "heart attack"]),
]

# Multilingual emergency patterns (subset for key languages)
EMERGENCY_PATTERNS_I18N: list[str] = [
    r"तेज\s*खून", r"भारी\s*रक्तस्राव", r"बेहोश", r"सांस\s*नहीं",
    r"गर्भावस्था.*खून", r"सीने\s*में\s*दर्द",
    r"அதிக\s*இரத்த", r"மூச்சு\s*வாங்க", r"மயக்கம்",
    r"রক্তপাত", r"শ্বাস\s*নেওয়া", r"অজ্ঞান",
    r"తీవ్ర\s*రక్త", r"శ్వాస", r"గర్భం.*రక్త",
]

SEVERITY_SCORES = {"mild": 15, "moderate": 40, "severe": 70}
RISK_LEVELS = ["Low", "Medium", "High", "Emergency"]


def _text_blob(*parts: str) -> str:
    return " ".join(p.lower() for p in parts if p)


def detect_emergency_keywords(text: str, pregnant: bool = False) -> tuple[bool, list[str]]:
    """Rule-based emergency detection from text."""
    blob = _text_blob(text)
    matched: list[str] = []

    for label, keywords in EMERGENCY_KEYWORDS:
        for kw in keywords:
            if kw in blob:
                matched.append(label)
                break

    for pattern in EMERGENCY_PATTERNS_I18N:
        if re.search(pattern, text, re.IGNORECASE):
            matched.append("multilingual_emergency_pattern")

    if pregnant:
        pregnancy_emergency = [
            "heavy bleeding", "severe pain", "no fetal movement",
            "contractions before 37 weeks", "severe headache vision",
            "गर्भावस्था", "bleeding while pregnant",
        ]
        for kw in pregnancy_emergency:
            if kw in blob:
                matched.append(f"pregnancy:{kw}")

    return len(matched) > 0, list(set(matched))


def compute_rule_risk(
    text: str,
    severity: str,
    urgency: str,
    pregnant: bool,
    selected_symptoms: list[str] | None = None,
) -> tuple[int, str]:
    """Compute rule-based risk score and level."""
    score = SEVERITY_SCORES.get(severity.lower(), 20)

    if urgency == "urgent":
        score = max(score, 75)
    elif urgency == "attention":
        score = max(score, 45)

    serious_symptoms = {"severe_headache", "chest_pain", "shortness_breath", "heavy_bleeding",
                        "severe_abdominal_pain", "blurred_vision", "fainting"}
    if selected_symptoms:
        for s in selected_symptoms:
            if s in serious_symptoms:
                score = min(100, score + 25)

    if pregnant and score >= 40:
        score = min(100, score + 15)

    is_emergency, _ = detect_emergency_keywords(text, pregnant)
    if is_emergency:
        return 100, "Emergency"

    if score >= 75:
        return score, "High"
    if score >= 45:
        return score, "Medium"
    return score, "Low"


def merge_risk(
    gemini_data: dict[str, Any],
    text: str,
    pregnant: bool,
    selected_symptoms: list[str] | None = None,
) -> dict[str, Any]:
    """Merge Gemini analysis with rule-based risk for final assessment."""
    severity = str(gemini_data.get("severity", "mild")).lower()
    urgency = str(gemini_data.get("urgency", "normal")).lower()
    rule_score, rule_level = compute_rule_risk(text, severity, urgency, pregnant, selected_symptoms)
    is_emergency, emergency_reasons = detect_emergency_keywords(text, pregnant)

    gemini_urgency_map = {"urgent": 80, "attention": 50, "normal": 20}
    gemini_score = gemini_urgency_map.get(urgency, 20)
    if severity == "severe":
        gemini_score = max(gemini_score, 70)
    elif severity == "moderate":
        gemini_score = max(gemini_score, 45)

    final_score = min(100, max(rule_score, gemini_score))

    if is_emergency:
        final_level = "Emergency"
        final_urgency = "urgent"
        emergency = True
    elif final_score >= 75:
        final_level = "High"
        final_urgency = "urgent" if urgency != "normal" else "urgent"
        emergency = False
    elif final_score >= 45:
        final_level = "Medium"
        final_urgency = "attention"
        emergency = False
    else:
        final_level = "Low"
        final_urgency = "normal"
        emergency = False

    return {
        "risk_score": final_score,
        "risk_level": final_level,
        "urgency": final_urgency,
        "emergency": emergency,
        "emergency_reasons": emergency_reasons,
    }
