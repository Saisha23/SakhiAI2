import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatHistory } from '../hooks/useChatHistory';
import type { ChatMessage } from '../types';

describe('useChatHistory Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty messages', () => {
    const { result } = renderHook(() => useChatHistory());
    expect(result.current.messages).toEqual([]);
  });

  it('should load messages from localStorage on mount', () => {
    const testMessages: ChatMessage[] = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there' },
    ];
    localStorage.setItem('sakhi_chat_history', JSON.stringify(testMessages));

    const { result } = renderHook(() => useChatHistory());
    expect(result.current.messages).toEqual(testMessages);
  });

  it('should add messages', () => {
    const { result } = renderHook(() => useChatHistory());

    act(() => {
      result.current.addMessage({ role: 'user', content: 'Test' });
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Test');
  });

  it('should persist messages to localStorage', () => {
    const { result } = renderHook(() => useChatHistory());

    act(() => {
      result.current.addMessage({ role: 'user', content: 'Test' });
    });

    const stored = JSON.parse(localStorage.getItem('sakhi_chat_history') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].content).toBe('Test');
  });

  it('should clear messages', () => {
    const { result } = renderHook(() => useChatHistory());

    act(() => {
      result.current.addMessage({ role: 'user', content: 'Test' });
    });

    expect(result.current.messages).toHaveLength(1);

    act(() => {
      result.current.clear();
    });

    expect(result.current.messages).toHaveLength(0);
    expect(localStorage.getItem('sakhi_chat_history')).toBeNull();
  });

  it('should respect maxItems limit', () => {
    const { result } = renderHook(() => useChatHistory(3));

    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.addMessage({ role: 'user', content: `Message ${i}` });
      }
    });

    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[0].content).toBe('Message 2');
  });
});
