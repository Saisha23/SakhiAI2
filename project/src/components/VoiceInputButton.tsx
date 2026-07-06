import type { Language } from '../types';
import { useVoiceInput } from '../hooks/useVoiceInput';

interface VoiceInputButtonProps {
  language: Language;
  onTranscript: (text: string) => void;
  label?: string;
}

export default function VoiceInputButton({ language, onTranscript, label = 'Speak' }: VoiceInputButtonProps) {
  const { isListening, isSupported, error, startListening, stopListening } = useVoiceInput(language);

  if (!isSupported) return null;

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(onTranscript);
    }
  };

  return (
    <div className="voice-input-wrapper">
      <button
        type="button"
        className={`voice-btn ${isListening ? 'listening' : ''}`}
        onClick={handleClick}
        aria-label={label}
        title={label}
      >
        {isListening ? '⏹' : '🎤'} {isListening ? 'Stop' : label}
      </button>
      {error && <span className="voice-error">{error}</span>}
    </div>
  );
}
