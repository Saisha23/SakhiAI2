from fastapi import APIRouter, HTTPException

try:
    from backend.models.request_models import AnalyzeRequest, AnalyzeResponse, ChatRequest, ChatResponse
    from backend.services.gemini_service import analyze_symptoms, chat_response, GeminiServiceError
    from backend.services.report_service import generate_report, build_report_json
    from backend.services.language_service import detect_language, get_language_name, sanitize_input
except ImportError:
    from models.request_models import AnalyzeRequest, AnalyzeResponse, ChatRequest, ChatResponse
    from services.gemini_service import analyze_symptoms, chat_response, GeminiServiceError
    from services.report_service import generate_report, build_report_json
    from services.language_service import detect_language, get_language_name, sanitize_input

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    try:
        text = sanitize_input(request.text)
        if not text:
            raise HTTPException(status_code=400, detail="Text input is required")

        combined_text = text
        if request.selected_symptoms:
            combined_text += " " + " ".join(request.selected_symptoms)

        analysis = analyze_symptoms(
            text=combined_text,
            language=request.language,
            pregnant=request.pregnant,
            selected_symptoms=request.selected_symptoms,
            body_part=request.body_part,
        )

        detected = analysis.get("detected_language", detect_language(text, request.language))
        lang_name = get_language_name(detected)

        report_text = generate_report(analysis, lang_name, request.pregnant, text)
        analysis["report_json"] = build_report_json(analysis)

        return AnalyzeResponse(
            symptoms=analysis.get("symptoms", []),
            severity=analysis.get("severity", "mild"),
            risk_level=analysis.get("risk_level", "Low"),
            possible_conditions=analysis.get("possible_conditions", []),
            recommendations=analysis.get("recommendations", []),
            report=report_text,
            detected_language=detected,
            urgency=analysis.get("urgency", "normal"),
            emergency=analysis.get("emergency", False),
            explanation=analysis.get("explanation", ""),
            doctor_advice=analysis.get("doctor_advice", ""),
            preventive_screenings=analysis.get("preventive_screenings", []),
            risk_score=analysis.get("risk_score", 0),
            condition_tags=analysis.get("condition_tags", []),
            has_pregnancy_alert=analysis.get("has_pregnancy_alert", False),
        )
    except GeminiServiceError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {exc}") from exc


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        message = sanitize_input(request.message, max_length=2000)
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")

        history = [{"role": m.role, "content": m.content} for m in request.history]
        response = chat_response(
            message=message,
            history=history,
            language=request.language,
            pregnant=request.pregnant,
        )
        return ChatResponse(response=response)
    except GeminiServiceError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Chat failed: {exc}") from exc
