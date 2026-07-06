export type Language =
  | 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu' | 'kn'
  | 'ml' | 'pa' | 'or' | 'ur' | 'as' | 'kok' | 'mni' | 'sa' | 'auto';

export type BodyPart = 'head' | 'chest' | 'abdomen' | 'pelvis' | 'legs' | 'skin';

export type Severity = 'serious' | 'moderate' | 'mild';

export interface Symptom {
  id: string;
  name: string;
  severity: Severity;
}

export interface BodyArea {
  id: BodyPart;
  name: string;
  symptoms: Symptom[];
}

export interface UserInput {
  language: Language;
  isPregnant: boolean | null;
  selectedBodyPart: BodyPart | null;
  selectedSymptoms: string[];
  additionalNotes: string;
  naturalLanguageInput?: string;
}

export interface Result {
  urgency: 'urgent' | 'attention' | 'normal';
  explanation: string;
  recommendations: string[];
  doctorAdvice: string;
  preventiveScreenings: string[];
  riskScore: number;
  conditionTags: string[];
  hasPregnancyAlert: boolean;
}

export interface AIAnalysisResult {
  symptoms: string[];
  severity: string;
  risk_level: string;
  possible_conditions: string[];
  recommendations: string[];
  report: string;
  detected_language: string;
  urgency: string;
  emergency: boolean;
  explanation: string;
  doctor_advice: string;
  preventive_screenings: string[];
  risk_score: number;
  condition_tags: string[];
  has_pregnancy_alert: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LanguageInfo {
  code: Language;
  name: string;
  native: string;
}
