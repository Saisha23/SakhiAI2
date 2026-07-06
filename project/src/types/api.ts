// API contract types
export interface AnalyzeRequest {
  text: string;
  language?: string | null;
  pregnant?: boolean;
  selected_symptoms?: string[];
  body_part?: string | null;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  language?: string | null;
  pregnant?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnalyzeResponse {
  symptoms: string[];
  severity: string;
  risk_level: string;
  possible_conditions: string[];
  recommendations: string[];
  report: string;
  detected_language?: string;
  urgency?: string;
  emergency?: boolean;
  explanation?: string;
  doctor_advice?: string;
  preventive_screenings?: string[];
  risk_score?: number;
  condition_tags?: string[];
  has_pregnancy_alert?: boolean;
}

export interface ChatResponse {
  response: string;
}

export interface HealthResponse {
  status: string;
  gemini_configured?: boolean;
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
