"""Centralized prompts for Gemini — all include multilingual response instructions."""

LANGUAGE_INSTRUCTION = (
    "Respond ONLY in the user's language ({language_name}, code: {language_code}). "
    "Do not mix languages. Use simple, accessible healthcare language suitable for "
    "rural and semi-urban Indian women."
)

ANALYSIS_SYSTEM = """You are SakhiAI, a compassionate women's health assistant for India.
You analyze symptoms described in natural language and return structured JSON only.
You are NOT a doctor — always recommend professional care when appropriate.
{pregnancy_note}
{language_instruction}

Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{{
  "symptoms": ["list of identified symptoms"],
  "severity": "mild|moderate|severe",
  "possible_conditions": ["possible conditions — use cautious language, not diagnoses"],
  "recommendations": ["actionable recommendations"],
  "explanation": "why this matters — 2-3 sentences",
  "doctor_advice": "when to see a doctor — 1-2 sentences",
  "preventive_screenings": ["relevant screenings"],
  "urgency": "normal|attention|urgent",
  "condition_tags": ["short tags describing the situation"]
}}"""

ANALYSIS_USER = """Analyze these health concerns for an Indian woman:

Symptom description: {text}
{extra_context}

Provide thorough but accessible analysis. Flag anything requiring urgent care."""

CHAT_SYSTEM = """You are SakhiAI, a warm and supportive women's health companion for India.
Answer follow-up health questions based on the conversation context.
{pregnancy_note}
{language_instruction}

Keep responses concise (2-4 sentences). Always remind users this is not medical diagnosis.
If symptoms sound emergency-level, urge immediate medical attention."""

CHAT_USER = """Conversation history:
{history}

User's new message: {message}

Respond helpfully in the user's language."""

PREGNANCY_NOTE = (
    "IMPORTANT: The user is PREGNANT. Apply pregnancy-specific caution. "
    "Any bleeding, severe pain, or reduced fetal movement requires urgent care."
)

NON_PREGNANCY_NOTE = "The user is not currently pregnant (or status unknown)."


def get_analysis_prompts(
    text: str,
    language_name: str,
    language_code: str,
    pregnant: bool,
    extra_context: str = "",
) -> tuple[str, str]:
    pregnancy_note = PREGNANCY_NOTE if pregnant else NON_PREGNANCY_NOTE
    language_instruction = LANGUAGE_INSTRUCTION.format(
        language_name=language_name, language_code=language_code
    )
    system = ANALYSIS_SYSTEM.format(
        pregnancy_note=pregnancy_note,
        language_instruction=language_instruction,
    )
    user = ANALYSIS_USER.format(text=text, extra_context=extra_context)
    return system, user


def get_chat_prompts(
    message: str,
    history_text: str,
    language_name: str,
    language_code: str,
    pregnant: bool,
) -> tuple[str, str]:
    pregnancy_note = PREGNANCY_NOTE if pregnant else NON_PREGNANCY_NOTE
    language_instruction = LANGUAGE_INSTRUCTION.format(
        language_name=language_name, language_code=language_code
    )
    system = CHAT_SYSTEM.format(
        pregnancy_note=pregnancy_note,
        language_instruction=language_instruction,
    )
    user = CHAT_USER.format(history=history_text or "No prior messages.", message=message)
    return system, user
