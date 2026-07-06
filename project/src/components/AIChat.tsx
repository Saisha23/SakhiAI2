import { useState, useEffect, useRef } from 'react';
import type { ChatMessage, Language } from '../types';
import { sendChatMessage } from '../utils/api';
import { useChatHistory } from '../hooks/useChatHistory';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { getT, tStr } from '../utils/i18n';
import VoiceInputButton from './VoiceInputButton';

interface SummaryData {
  symptoms: string[];
  assessment: string;
  riskLabel: string;
  riskColor: string;
}

interface AIChatProps {
  language: Language;
  pregnant: boolean;
  summary?: SummaryData;
  onClose?: () => void;
}

export default function AIChat({
  language,
  pregnant,
  summary,
  onClose,
}: AIChatProps) {
  const t = getT(language);
  const { messages, addMessage, clear } = useChatHistory(50);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isSpeaking, isSupported: ttsSupported, speak, stop } = useTextToSpeech(language);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    addMessage(userMsg);
    setInput('');
    setLoading(true);
    setError(null);
    setRetryCount(0);

    try {
      const response = await sendChatMessage({
        message: userMsg.content,
        history: messages,
        language,
        pregnant,
      });
      addMessage({ role: 'assistant', content: response });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Chat failed';
      setError(errorMsg);
      if (retryCount < 2) {
        setRetryCount((p) => p + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    if (messages.length === 0) return;
    const lastUserMsg = [...messages]
      .reverse()
      .find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    setError(null);
    setLoading(true);
    try {
      const response = await sendChatMessage({
        message: lastUserMsg.content,
        history: messages.filter((m) => m !== lastUserMsg),
        language,
        pregnant,
      });
      addMessage({ role: 'assistant', content: response });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Retry failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all messages?')) {
      clear();
      setError(null);
    }
  };

  const handleSpeakMessage = (text: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-header-bar">
        <h3 className="chat-title">💬 {tStr(t, 'askSakhi', 'Ask Sakhi')}</h3>
        <div className="chat-header-actions">
          <button
            className="text-btn chat-clear-btn"
            onClick={handleClear}
            type="button"
            title="Clear conversation history"
          >
            {tStr(t, 'clearChat', 'Clear')}
          </button>
          {onClose && (
            <button
              className="text-btn close-btn"
              onClick={onClose}
              type="button"
              title="Close chat"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {summary && (
        <div className="chat-summary-card">
          <div className="chat-summary-row">
            <div>
              <div className="summary-label">{tStr(t, 'selectedSymptoms', 'Selected symptoms')}</div>
              <div className="summary-text">{summary.symptoms.length > 0 ? summary.symptoms.join(', ') : tStr(t, 'noSymptoms', 'No symptoms selected')}</div>
            </div>
            <div className="summary-pill" style={{ backgroundColor: summary.riskColor }}>
              {summary.riskLabel}
            </div>
          </div>
          <div className="summary-assessment">
            <div className="summary-label">{tStr(t, 'aiAssessment', 'AI assessment')}</div>
            <p>{summary.assessment}</p>
          </div>
        </div>
      )}

      <div className="chat-messages-area">
        {messages.length === 0 && (
          <div className="chat-empty-state">
            <p className="chat-empty-icon">💭</p>
            <p className="chat-empty-text">
              {tStr(t, 'chatPlaceholder', 'Ask a follow-up question about your symptoms...')}
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message-bubble ${msg.role}`}>
            <div className="chat-message-content">{msg.content}</div>
            {msg.role === 'assistant' && ttsSupported && (
              <button
                className="chat-msg-tts-btn"
                onClick={() => handleSpeakMessage(msg.content)}
                type="button"
                title={isSpeaking ? 'Stop' : 'Read aloud'}
              >
                {isSpeaking ? '⏹' : '🔊'}
              </button>
            )}
          </div>
        ))}

        {loading && (
          <div className="chat-message-bubble assistant typing">
            <span className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        )}

        {error && (
          <div className="chat-error-box">
            <p className="chat-error-text">⚠️ {error}</p>
            {retryCount < 2 && (
              <button
                className="secondary-btn retry-btn"
                onClick={handleRetry}
                type="button"
              >
                Retry ({2 - retryCount} left)
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-input-row">
          <input
            className="chat-input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={tStr(t, 'typeQuestion', 'Type your question...')}
            disabled={loading}
            type="text"
          />
          <VoiceInputButton
            language={language}
            label={tStr(t, 'voiceInput', 'Voice')}
            onTranscript={(text) => setInput((prev) => (prev ? `${prev} ${text}` : text))}
          />
          <button
            className="primary-btn send-btn"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            type="button"
          >
            {tStr(t, 'send', 'Send')}
          </button>
        </div>
      </div>
    </div>
  );
}
