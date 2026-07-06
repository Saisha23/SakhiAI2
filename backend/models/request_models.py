from pydantic import BaseModel, Field, field_validator
from typing import List, Optional


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    language: str = Field(default="auto", max_length=10)
    pregnant: bool = False
    selected_symptoms: Optional[List[str]] = Field(default_factory=list)
    body_part: Optional[str] = None

    @field_validator("text")
    @classmethod
    def sanitize_text(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Text cannot be empty")
        return cleaned


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., min_length=1, max_length=2000)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: List[ChatMessage] = Field(default_factory=list)
    language: str = Field(default="auto", max_length=10)
    pregnant: bool = False

    @field_validator("message")
    @classmethod
    def sanitize_message(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Message cannot be empty")
        return cleaned


class AnalyzeResponse(BaseModel):
    symptoms: List[str]
    severity: str
    risk_level: str
    possible_conditions: List[str]
    recommendations: List[str]
    report: str
    detected_language: str
    urgency: str
    emergency: bool
    explanation: str = ""
    doctor_advice: str = ""
    preventive_screenings: List[str] = Field(default_factory=list)
    risk_score: int = 0
    condition_tags: List[str] = Field(default_factory=list)
    has_pregnancy_alert: bool = False


class ChatResponse(BaseModel):
    response: str
