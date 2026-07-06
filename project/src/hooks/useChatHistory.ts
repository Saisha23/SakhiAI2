import { useEffect, useState } from 'react';
import type { ChatMessage } from '../types';

const CHAT_STORAGE_KEY = 'sakhi_chat_history';

export function useChatHistory(maxItems = 50) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-maxItems)));
    } catch {
      // ignore
    }
  }, [messages, maxItems]);

  const addMessage = (msg: ChatMessage) => setMessages((prev) => [...prev, msg].slice(-maxItems));
  const clear = () => {
    setMessages([]);
    try { localStorage.removeItem(CHAT_STORAGE_KEY); } catch { }
  };

  return { messages, addMessage, clear };
}
