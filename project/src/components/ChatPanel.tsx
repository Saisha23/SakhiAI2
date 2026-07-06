import { useState, useEffect, useRef } from 'react';
import type { ChatMessage, Language } from '../types';
import { sendChatMessage } from '../utils/api';
import { getT, tStr } from '../utils/i18n';
import VoiceInputButton from './VoiceInputButton';
import { useChatHistory } from '../hooks/useChatHistory';

interface ChatPanelProps {
  language: Language;
  pregnant: boolean;
  contextSummary?: string;
}

export default function ChatPanel({ language, pregnant, contextSummary }: ChatPanelProps) {
  const t = getT(language);
  const { messages, addMessage, clear } = useChatHistory(50);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    addMessage(userMsg);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage({
        message: userMsg.content,
        history: messages,
        language,
        pregnant,
      });
      addMessage({ role: 'assistant', content: response });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chat failed');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    clear();
  };

  return (
    <section className="chat-panel">
      <div className="chat-header">
        <h3 className="section-title">{tStr(t, 'askSakhi', 'Ask Sakhi')}</h3>
        <button className="text-btn" onClick={clearChat} type="button">
          {tStr(t, 'clearChat', 'Clear')}
        </button>
      </div>
      {contextSummary && <p className="chat-context">{contextSummary}</p>}
      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-empty">{tStr(t, 'chatPlaceholder', 'Ask a follow-up question about your symptoms...')}</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="chat-bubble assistant typing">...</div>}
        <div ref={bottomRef} />
      </div>
      {error && <p className="chat-error">{error}</p>}
      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={tStr(t, 'chatPlaceholder', 'Type your question...')}
          disabled={loading}
        />
        <VoiceInputButton language={language} onTranscript={(text) => setInput((prev) => (prev ? `${prev} ${text}` : text))} />
        <button className="primary-btn chat-send-btn" onClick={handleSend} disabled={loading || !input.trim()} type="button">
          {tStr(t, 'send', 'Send')}
        </button>
      </div>
    </section>
  );
}
