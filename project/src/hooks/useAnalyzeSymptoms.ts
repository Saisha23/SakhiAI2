import { useState, useCallback } from 'react';
import type { AIAnalysisResult, Language } from '../types';
import { analyzeSymptoms as apiAnalyze } from '../utils/api';

export function useAnalyzeSymptoms() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (params: { text: string; language: Language; pregnant: boolean; selectedSymptoms?: string[]; bodyPart?: string | null; }) => {
    setLoading(true);
    setError(null);
    try {
      const res: AIAnalysisResult = await apiAnalyze({
        text: params.text,
        language: params.language,
        pregnant: params.pregnant,
        selectedSymptoms: params.selectedSymptoms,
        bodyPart: params.bodyPart,
      });
      return res;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyze, loading, error };
}
