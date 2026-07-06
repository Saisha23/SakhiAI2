import type { AIAnalysisResult, ChatMessage, Language } from '../types';
import { apiService, ApiError } from '../services/api';

export { ApiError };

export async function analyzeSymptoms(params: {
  text: string;
  language: Language;
  pregnant: boolean;
  selectedSymptoms?: string[];
  bodyPart?: string | null;
}): Promise<AIAnalysisResult> {
  const response = await apiService.analyzeSymptoms({
    text: params.text,
    language: params.language === 'auto' ? undefined : params.language,
    pregnant: params.pregnant,
    selected_symptoms: params.selectedSymptoms,
    body_part: params.bodyPart,
  });
  return response as AIAnalysisResult;
}

export async function sendChatMessage(params: {
  message: string;
  history: ChatMessage[];
  language: Language;
  pregnant: boolean;
}): Promise<string> {
  const response = await apiService.sendChatMessage({
    message: params.message,
    history: params.history,
    language: params.language === 'auto' ? undefined : params.language,
    pregnant: params.pregnant,
  });
  return response.response;
}

export async function checkHealth(): Promise<{ status: string; gemini_configured: boolean }> {
  const health = await apiService.checkHealth();
  return {
    status: health.status,
    gemini_configured: health.gemini_configured || false,
  };
}
