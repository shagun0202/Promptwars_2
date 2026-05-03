/**
 * @fileoverview Custom hook for Google Gemini AI integration.
 * Uses @google/generative-ai SDK with streaming, conversation history, and rate limiting.
 */

import { useState, useCallback, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatMessage, RateLimitState } from '@/types';
import { GEMINI_MODEL, GEMINI_MAX_TOKENS, GEMINI_MAX_TURNS, GEMINI_SYSTEM_INSTRUCTION } from '@/constants';
import { sanitizeInput } from '@/utils/sanitize';
import { validateChatMessage } from '@/utils/validate';
import { checkRateLimit, createRateLimitState, resetRateLimit } from '@/utils/rateLimit';
import { getMockGeminiResponse, MOCK_WELCOME_MESSAGE } from '@/utils/mockData';
import { logger } from '@/utils/logger';

/** Return type of useGemini hook */
export interface UseGeminiReturn {
  readonly messages: ChatMessage[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly isDemoMode: boolean;
  readonly rateLimitState: RateLimitState;
  readonly sendMessage: (message: string) => Promise<void>;
  readonly resetChat: () => void;
}

/**
 * Hook for Gemini AI chat with streaming, history management, and rate limiting.
 * Falls back to mock data when API key is missing or on error.
 * @returns Chat state and methods
 */
export function useGemini(): UseGeminiReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([MOCK_WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>(createRateLimitState());

  const apiKey = import.meta.env['VITE_GEMINI_API_KEY'] as string | undefined;
  const chatRef = useRef<ReturnType<ReturnType<GoogleGenerativeAI['getGenerativeModel']>['startChat']> | null>(null);
  const modelRef = useRef<ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null>(null);

  /** Initialize the Gemini model and chat session */
  const initChat = useCallback(() => {
    if (!apiKey) {
      setIsDemoMode(true);
      return false;
    }
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      modelRef.current = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: { maxOutputTokens: GEMINI_MAX_TOKENS },
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
      });

      const history = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-GEMINI_MAX_TURNS * 2)
        .map((m) => ({ role: m.role, parts: [{ text: m.content }] }));

      chatRef.current = modelRef.current.startChat({ history });
      return true;
    } catch (err) {
      logger.error('Gemini init failed', err);
      setIsDemoMode(true);
      return false;
    }
  }, [apiKey, messages]);

  /** Simulate streaming for mock responses */
  const simulateStreaming = useCallback(async (id: string, text: string): Promise<void> => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === id);
      if (exists) return prev;
      return [...prev, { id, role: 'model' as const, content: '', timestamp: new Date().toISOString(), isStreaming: true }];
    });

    const words = text.split(' ');
    let accumulated = '';
    for (const word of words) {
      accumulated += (accumulated ? ' ' : '') + word;
      const snapshot = accumulated;
      setMessages((prev) =>
        prev.map((m) => m.id === id ? { ...m, content: snapshot } : m)
      );
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    setMessages((prev) =>
      prev.map((m) => m.id === id ? { ...m, content: text, isStreaming: false } : m)
    );
  }, []);

  /** Send a message and get a streaming response */
  const sendMessage = useCallback(async (message: string): Promise<void> => {
    const validation = validateChatMessage(message);
    if (!validation.isValid) {
      setError(validation.error ?? 'Invalid message');
      return;
    }

    const { newState, allowed, showWarning } = checkRateLimit(rateLimitState);
    setRateLimitState(newState);
    if (!allowed) {
      setError('You have reached the message limit for this session.');
      return;
    }
    if (showWarning) {
      setError('You have 2 messages remaining in this session.');
    }

    const sanitized = sanitizeInput(message);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: sanitized,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    const assistantId = `model-${Date.now()}`;

    try {
      const initialized = initChat();
      if (!initialized || !chatRef.current) {
        const mockText = getMockGeminiResponse(sanitized);
        await simulateStreaming(assistantId, mockText);
        setIsDemoMode(true);
        return;
      }

      const result = await chatRef.current.sendMessageStream(sanitized);
      let fullText = '';

      setMessages((prev) => [...prev, {
        id: assistantId, role: 'model', content: '', timestamp: new Date().toISOString(), isStreaming: true,
      }]);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        fullText += text;
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: fullText } : m)
        );
      }

      setMessages((prev) =>
        prev.map((m) => m.id === assistantId ? { ...m, content: fullText, isStreaming: false } : m)
      );
    } catch (err: unknown) {
      logger.error('Gemini API error', err);
      const is429 = err instanceof Error && err.message.includes('429');
      if (is429) {
        setError('AI is busy — using demo responses. Will retry automatically.');
      }
      setIsDemoMode(true);
      const mockText = getMockGeminiResponse(sanitized);
      await simulateStreaming(assistantId, mockText);
    } finally {
      setIsLoading(false);
    }
  }, [rateLimitState, initChat, simulateStreaming]);

  /** Reset the chat conversation */
  const resetChat = useCallback(() => {
    setMessages([MOCK_WELCOME_MESSAGE]);
    setRateLimitState(resetRateLimit());
    setError(null);
    chatRef.current = null;
    setIsDemoMode(!apiKey);
  }, [apiKey]);

  return { messages, isLoading, error, isDemoMode, rateLimitState, sendMessage, resetChat };
}
