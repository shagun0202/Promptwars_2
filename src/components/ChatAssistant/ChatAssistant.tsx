/**
 * @fileoverview AI Chat Assistant component powered by Gemini.
 * Floating panel with streaming responses, rate limiting, and suggested questions.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useGemini } from '@/hooks/useGemini';
import { useTranslation } from '@/contexts/TranslationContext';
import { GEMINI_MODEL, SUGGESTED_QUESTIONS } from '@/constants';
import { validateChatMessage } from '@/utils/validate';
import { SkeletonLoader } from '@/components/SkeletonLoader';

/** Props for the ChatAssistant component */
interface ChatAssistantProps {
  /** Whether the chat panel is open */
  readonly isOpen: boolean;
  /** Callback to toggle the chat panel */
  readonly onToggle: () => void;
  /** Initial message to send (from Ask AI buttons) */
  readonly initialMessage?: string;
}

/**
 * Floating AI chat assistant panel.
 * Features streaming responses, suggested questions, and rate limiting.
 * @param props - Component props
 * @returns Chat assistant JSX
 */
export function ChatAssistant({ isOpen, onToggle, initialMessage }: ChatAssistantProps): JSX.Element {
  const { messages, isLoading, error, isDemoMode, rateLimitState, sendMessage, resetChat } = useGemini();
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /** Scroll to bottom on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** Focus input when panel opens */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  /** Handle initial message from Ask AI buttons */
  useEffect(() => {
    if (initialMessage && isOpen) {
      sendMessage(initialMessage).catch(() => { /* handled in hook */ });
    }
  }, [initialMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Focus trap inside modal */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onToggle();
        return;
      }

      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, input, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  /** Handle form submission */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateChatMessage(input);
    if (!validation.isValid) {
      setInputError(validation.error ?? null);
      return;
    }
    setInputError(null);
    try {
      await sendMessage(input);
    } catch { /* handled in hook */ }
    setInput('');
  }, [input, sendMessage]);

  /** Handle suggested question click */
  const handleSuggestion = useCallback(async (question: string) => {
    try {
      await sendMessage(question);
    } catch { /* handled in hook */ }
  }, [sendMessage]);

  /** Handle input change */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setInputError(null);
  }, []);

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        className={`chat__fab ${isOpen ? 'chat__fab--open' : ''}`}
        onClick={onToggle}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
        id="chat-toggle"
      >
        <span aria-hidden="true">{isOpen ? '✕' : '✦'}</span>
      </button>

      {/* Chat panel */}
      {isOpen && (
        <aside
          className="chat__panel"
          id="chat-panel"
          role="dialog"
          aria-label={t('chat.title')}
          aria-modal="true"
          ref={panelRef}
        >
          {/* Header */}
          <div className="chat__header">
            <h2 className="chat__title">{t('chat.title')}</h2>
            <div className="chat__header-actions">
              <button
                type="button"
                className="chat__reset-button"
                onClick={resetChat}
                aria-label="Reset chat conversation"
                title={t('chat.reset')}
              >
                ↻
              </button>
              <button
                type="button"
                className="chat__close-button"
                onClick={onToggle}
                aria-label="Close chat panel"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Demo mode indicator */}
          {isDemoMode && (
            <div className="chat__demo-badge" role="status">
              Demo Mode
            </div>
          )}

          {/* Messages */}
          <div className="chat__messages" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat__message chat__message--${msg.role}`}
                aria-label={`${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`}
              >
                <div className="chat__message-content">
                  {msg.content}
                  {msg.isStreaming && <span className="chat__cursor" aria-hidden="true">▊</span>}
                </div>
                {msg.role === 'model' && (
                  <span className="chat__model-tag" aria-label={`Response from ${GEMINI_MODEL}`}>
                    {GEMINI_MODEL}
                  </span>
                )}
              </div>
            ))}

            {isLoading && !messages.some((m) => m.isStreaming) && (
              <div className="chat__message chat__message--model">
                <SkeletonLoader lines={2} ariaLabel="AI is thinking..." />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {messages.length <= 1 && (
            <div className="chat__suggestions" role="group" aria-label="Suggested questions">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="chat__suggestion"
                  onClick={() => handleSuggestion(q)}
                  aria-label={`Ask: ${q}`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Error / Warning display */}
          {(error ?? inputError) && (
            <div className="chat__error" role="alert" aria-live="assertive">
              {error ?? inputError}
            </div>
          )}

          {/* Input form */}
          <form className="chat__form" onSubmit={handleSubmit}>
            <label htmlFor="chat-input" className="sr-only">
              {t('chat.placeholder')}
            </label>
            <input
              ref={inputRef}
              id="chat-input"
              type="text"
              className="chat__input"
              value={input}
              onChange={handleInputChange}
              placeholder={t('chat.placeholder')}
              maxLength={500}
              disabled={rateLimitState.limitReached}
              aria-label="Type your question about elections"
              autoComplete="off"
            />
            <button
              type="submit"
              className="chat__send-button"
              disabled={isLoading || !input.trim() || rateLimitState.limitReached}
              aria-label={t('chat.send')}
            >
              {t('chat.send')}
            </button>
          </form>

          {/* Footer */}
          <div className="chat__footer">
            <span className="chat__powered">{t('chat.powered')}</span>
            <p className="chat__disclaimer">{t('chat.disclaimer')}</p>
          </div>
        </aside>
      )}
    </>
  );
}
