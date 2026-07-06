import type {
  AnalyzeRequest,
  AnalyzeResponse,
  ChatRequest,
  ChatResponse,
  HealthResponse,
} from '../types/api';
import { ApiError } from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const TIMEOUT_MS = 30000;

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function request<T>(endpoint: string, options: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      let detail = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorBody = await response.json();
        detail = errorBody.detail || detail;
      } catch {
        // keep default error message
      }
      throw new ApiError(detail, response.status);
    }

    return response.json() as Promise<T>;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      throw new ApiError('Network error: backend unreachable. Ensure backend is running at ' + API_BASE);
    }
    throw new ApiError(err instanceof Error ? err.message : 'Unknown error');
  }
}

export const apiService = {
  async analyzeSymptoms(params: AnalyzeRequest): Promise<AnalyzeResponse> {
    return request<AnalyzeResponse>('/analyze', {
      method: 'POST',
      body: JSON.stringify({
        text: params.text,
        language: params.language,
        pregnant: params.pregnant || false,
        selected_symptoms: params.selected_symptoms,
        body_part: params.body_part,
      }),
    });
  },

  async sendChatMessage(params: ChatRequest): Promise<ChatResponse> {
    return request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: params.message,
        history: params.history || [],
        language: params.language,
        pregnant: params.pregnant || false,
      }),
    });
  },

  async checkHealth(): Promise<HealthResponse> {
    return request<HealthResponse>('/health', {
      method: 'GET',
    });
  },
};

export type { AnalyzeRequest, AnalyzeResponse, ChatRequest, ChatResponse, HealthResponse };
export { ApiError };
