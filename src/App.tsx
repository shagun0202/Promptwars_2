/**
 * @fileoverview Main application component for SmartElect.
 * Assembles all sections with error boundaries and lazy loading.
 */

import { useState, useCallback, lazy, Suspense } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { AccessibilityBar } from '@/components/AccessibilityBar';
import { Timeline } from '@/components/Timeline';
import { ChatAssistant } from '@/components/ChatAssistant';
import { PollingFinder } from '@/components/PollingFinder';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { APP_NAME, DEMO_BANNER_TEXT } from '@/constants';

/** Lazy-loaded VideoHub for code splitting */
const LazyVideoHub = lazy(() =>
  import('@/components/VideoHub/VideoHub').then((mod) => ({ default: mod.VideoHub }))
);

/**
 * Root application component.
 * @returns Application JSX
 */
function App(): JSX.Element {
  const { t } = useTranslation();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);
  const [showDemoBanner] = useState(() => {
    const keys = [
      import.meta.env['VITE_GEMINI_API_KEY'],
      import.meta.env['VITE_MAPS_API_KEY'],
      import.meta.env['VITE_YOUTUBE_API_KEY'],
      import.meta.env['VITE_TTS_API_KEY'],
      import.meta.env['VITE_TRANSLATE_API_KEY'],
    ];
    return keys.some((k) => !k);
  });

  /** Toggle chat panel */
  const handleChatToggle = useCallback(() => {
    setChatOpen((prev) => !prev);
    if (chatOpen) {
      setChatInitialMessage(undefined);
    }
  }, [chatOpen]);

  /** Handle "Ask AI" from timeline */
  const handleAskAi = useCallback((question: string) => {
    setChatInitialMessage(question);
    setChatOpen(true);
  }, []);

  return (
    <div className="app">
      {/* Skip to content — first DOM element */}
      <a href="#main-content" className="skip-link" id="skip-link">
        {t('a11y.skipToContent')}
      </a>

      {/* Accessibility toolbar */}
      <ErrorBoundary sectionName="Accessibility Bar">
        <AccessibilityBar />
      </ErrorBoundary>

      {/* Demo mode banner */}
      {showDemoBanner && (
        <div className="demo-banner" role="status" aria-live="polite">
          <span className="demo-banner__icon" aria-hidden="true">⚡</span>
          {DEMO_BANNER_TEXT}
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header__inner">
          <div className="header__brand">
            <h1 className="header__title">{APP_NAME}</h1>
            <p className="header__tagline">{t('nav.tagline')}</p>
          </div>
          <div className="header__emblem" aria-hidden="true">
            <span className="header__emblem-icon">🏛️</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="main">
        {/* Election Timeline */}
        <ErrorBoundary sectionName="Election Timeline">
          <Timeline onAskAi={handleAskAi} />
        </ErrorBoundary>

        {/* Polling Station Finder */}
        <ErrorBoundary sectionName="Polling Station Finder">
          <PollingFinder />
        </ErrorBoundary>

        {/* Video Learning Hub — Lazy Loaded */}
        <ErrorBoundary sectionName="Video Learning Hub">
          <Suspense fallback={
            <section className="video-hub" aria-label="Loading videos">
              <div className="video-hub__grid">
                <SkeletonLoader variant="video" ariaLabel="Loading video hub..." />
                <SkeletonLoader variant="video" ariaLabel="Loading video hub..." />
                <SkeletonLoader variant="video" ariaLabel="Loading video hub..." />
              </div>
            </section>
          }>
            <LazyVideoHub />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__inner">
          <p className="footer__text">
            © {new Date().getFullYear()} {APP_NAME}. Built for civic education.
          </p>
          <p className="footer__disclaimer">
            {t('chat.disclaimer')}
          </p>
        </div>
      </footer>

      {/* AI Chat Assistant */}
      <ErrorBoundary sectionName="AI Chat Assistant">
        <ChatAssistant
          isOpen={chatOpen}
          onToggle={handleChatToggle}
          initialMessage={chatInitialMessage}
        />
      </ErrorBoundary>
    </div>
  );
}

export default App;
