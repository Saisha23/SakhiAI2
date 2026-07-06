"""Professional health report generation from analysis data."""

from datetime import datetime, timezone
from typing import Any


def generate_report(
    analysis: dict[str, Any],
    language_name: str,
    pregnant: bool,
    original_text: str,
) -> str:
    """Build a structured narrative health report."""
    symptoms = analysis.get("symptoms", [])
    risk_level = analysis.get("risk_level", "Low")
    urgency = analysis.get("urgency", "normal")
    conditions = analysis.get("possible_conditions", [])
    recommendations = analysis.get("recommendations", [])
    explanation = analysis.get("explanation", "")
    doctor_advice = analysis.get("doctor_advice", "")
    screenings = analysis.get("preventive_screenings", [])

    urgency_label = {
        "urgent": "Urgent Care Needed",
        "attention": "Needs Attention",
        "normal": "Normal Care",
    }.get(urgency, urgency)

    lines = [
        f"=== SakhiAI Health Report ===",
        f"Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        f"Language: {language_name}",
        f"Pregnancy Status: {'Pregnant' if pregnant else 'Not pregnant'}",
        "",
        f"--- Summary ---",
        f"Risk Level: {risk_level}",
        f"Urgency: {urgency_label}",
        f"Emergency Flag: {'YES — Seek immediate care' if analysis.get('emergency') else 'No'}",
        "",
        f"--- Reported Concerns ---",
        original_text[:500],
        "",
        f"--- Identified Symptoms ---",
    ]
    lines.extend(f"• {s}" for s in symptoms) if symptoms else lines.append("• None specifically identified")
    lines.extend(["", "--- Possible Conditions (not a diagnosis) ---"])
    lines.extend(f"• {c}" for c in conditions) if conditions else lines.append("• Further evaluation recommended")
    lines.extend(["", f"--- Why This Matters ---", explanation, "", "--- Recommendations ---"])
    lines.extend(f"• {r}" for r in recommendations) if recommendations else lines.append("• Monitor symptoms")
    lines.extend(["", f"--- When to See a Doctor ---", doctor_advice, "", "--- Preventive Screenings ---"])
    lines.extend(f"• {s}" for s in screenings) if screenings else lines.append("• Regular health check-ups")
    if pregnant:
        lines.extend(["", "--- Pregnancy Note ---", "Special caution applies during pregnancy. Consult your doctor for any concerns."])
    lines.extend(["", "--- Disclaimer ---", "This report is for informational purposes only and does not replace professional medical advice."])
    return "\n".join(lines)


def build_report_json(analysis: dict[str, Any]) -> dict[str, Any]:
    """Structured report payload for frontend cards."""
    return {
        "summary": {
            "risk_level": analysis.get("risk_level"),
            "risk_score": analysis.get("risk_score", 0),
            "urgency": analysis.get("urgency"),
            "emergency": analysis.get("emergency", False),
            "severity": analysis.get("severity"),
        },
        "symptoms": analysis.get("symptoms", []),
        "possible_conditions": analysis.get("possible_conditions", []),
        "explanation": analysis.get("explanation", ""),
        "recommendations": analysis.get("recommendations", []),
        "doctor_advice": analysis.get("doctor_advice", ""),
        "preventive_screenings": analysis.get("preventive_screenings", []),
        "condition_tags": analysis.get("condition_tags", []),
        "has_pregnancy_alert": analysis.get("has_pregnancy_alert", False),
    }
