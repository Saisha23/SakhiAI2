import { useCallback } from 'react';
import { useVoiceInput } from './useVoiceInput';
import type { Language } from '../types';

export function useSpeechRecognition(language: Language) {
  const { isListening, isSupported, error, startListening, stopListening } = useVoiceInput(language);

  const start = useCallback((onResult: (text: string) => void) => startListening(onResult), [startListening]);
  const stop = useCallback(() => stopListening(), [stopListening]);

  return { isListening, isSupported, error, start, stop };
}
