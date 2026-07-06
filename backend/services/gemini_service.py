"""Google Gemini API integration."""

import json
import os
import re
import logging
from typing import Any, Optional

import google.generativeai as genai
from dotenv import load_dotenv

try:
    from backend.utils.prompts import get_analysis_prompts, get_chat_prompts
    from backend.services.language_service import detect_language, get_language_name, sanitize_input
except ImportError:
    from utils.prompts import get_analysis_prompts, get_chat_prompts
    from services.language_service import detect_language, get_language_name, sanitize_input

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    load_dotenv()

logger = logging.getLogger(__name__)

MODEL_NAME = "gemini-2.5-flash"


class GeminiServiceError(Exception):
    """Raised when Gemini API calls fail."""


def _get_api_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        raise GeminiServiceError(
            "GEMINI_API_KEY is not configured. Add it to backend/.env"
        )
    return key


def _configure() -> None:
    genai.configure(api_key=_get_api_key())


def _extract_json(text: str) -> dict[str, Any]:
    """Extract JSON from Gemini response, handling markdown fences."""
    text = text.strip()
    fence = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if fence:
        text = fence.group(1).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start >= 0 and end > start:
            return json.loads(text[start : end + 1])
        raise GeminiServiceError("Invalid JSON response from Gemini")


def _fallback_analysis(text: str, language_code: str, pregnant: bool) -> dict[str, Any]:
    """Rule-based fallback when Gemini is unavailable."""
    try:
        from backend.services.risk_engine import detect_emergency_keywords, merge_risk
    except ImportError:
        from services.risk_engine import detect_emergency_keywords, merge_risk

    is_emergency, _ = detect_emergency_keywords(text, pregnant)
    base = {
        "symptoms": [text[:100]],
        "severity": "severe" if is_emergency else "moderate",
        "possible_conditions": ["Requires professional evaluation"],
        "recommendations": [
            "Consult a healthcare provider for proper assessment",
            "Monitor your symptoms closely",
        ],
        "explanation": "Your symptoms have been noted. Professional evaluation is recommended.",
        "doctor_advice": "Please see a doctor if symptoms persist or worsen.",
        "preventive_screenings": ["Annual health check-up"],
        "urgency": "urgent" if is_emergency else "attention",
        "condition_tags": ["Health concern noted"],
    }
    merged = merge_risk(base, text, pregnant)
    base.update(merged)
    base["has_pregnancy_alert"] = pregnant and base["urgency"] != "normal"
    return base


def analyze_symptoms(
    text: str,
    language: str = "auto",
    pregnant: bool = False,
    selected_symptoms: Optional[list[str]] = None,
    body_part: Optional[str] = None,
) -> dict[str, Any]:
    """Analyze symptoms using Gemini with structured JSON output."""
    text = sanitize_input(text)
    detected = detect_language(text, language)
    lang_name = get_language_name(detected)

    extra_parts = []
    if body_part:
        extra_parts.append(f"Body area: {body_part}")
    if selected_symptoms:
        extra_parts.append(f"Selected symptoms: {', '.join(selected_symptoms)}")
    extra_context = "\n".join(extra_parts)

    system_prompt, user_prompt = get_analysis_prompts(
        text, lang_name, detected, pregnant, extra_context
    )

    try:
        _configure()
        model = genai.GenerativeModel(
            MODEL_NAME,
            system_instruction=system_prompt,
        )
        response = model.generate_content(
            user_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
                response_mime_type="application/json",
            ),
        )
        data = _extract_json(response.text)
    except GeminiServiceError:
        raise
    except Exception as exc:
        logger.warning("Gemini analysis failed, using fallback: %s", exc)
        data = _fallback_analysis(text, detected, pregnant)

    try:
        from backend.services.risk_engine import merge_risk
    except ImportError:
        from services.risk_engine import merge_risk

    merged = merge_risk(data, text, pregnant, selected_symptoms)
    data.update(merged)
    data["detected_language"] = detected
    data["has_pregnancy_alert"] = pregnant and data.get("urgency") != "normal"
    return data


def chat_response(
    message: str,
    history: list[dict[str, str]],
    language: str = "auto",
    pregnant: bool = False,
) -> str:
    """Generate a follow-up chat response."""
    message = sanitize_input(message, max_length=2000)
    detected = detect_language(message, language)
    lang_name = get_language_name(detected)

    history_lines = []
    for msg in history[-10:]:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        history_lines.append(f"{role.capitalize()}: {content}")
    history_text = "\n".join(history_lines)

    system_prompt, user_prompt = get_chat_prompts(
        message, history_text, lang_name, detected, pregnant
    )

    try:
        _configure()
        model = genai.GenerativeModel(
            MODEL_NAME,
            system_instruction=system_prompt,
        )
        response = model.generate_content(
            user_prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.5),
        )
        return response.text.strip()
    except Exception as exc:
        logger.warning("Gemini chat failed: %s", exc)
        if detected == "hi":
            return "क्षमा करें, अभी मैं उत्तर नहीं दे पा रही हूं। कृपया अपने नजदीकी डॉक्टर से consult करें।"
        return "Sorry, I cannot respond right now. Please consult a healthcare provider for your concerns."
