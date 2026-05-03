/**
 * @fileoverview Interactive Election Timeline component.
 * Displays 6 election steps with explanations, checklists, TTS, and AI integration.
 */

import { useState, useCallback } from 'react';
import { ELECTION_STEPS } from '@/constants';
import { useTranslation } from '@/contexts/TranslationContext';
import { useTTS } from '@/hooks/useTTS';
import { SkeletonLoader } from '@/components/SkeletonLoader';

/** Props for the Timeline component */
interface TimelineProps {
  /** Callback to open chat with a contextual question */
  readonly onAskAi: (question: string) => void;
}

/**
 * Interactive 6-step election timeline.
 * Each step has listen button (TTS), ask AI button, and official resource links.
 * @param props - Component props
 * @returns Timeline JSX
 */
export function Timeline({ onAskAi }: TimelineProps): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const { t, currentLanguage } = useTranslation();
  const { speak, stop, isPlaying, isLoading: ttsLoading } = useTTS();

  /** Handle step navigation */
  const handleStepClick = useCallback((index: number) => {
    setActiveStep(index);
  }, []);

  /** Handle keyboard navigation on step indicators */
  const handleStepKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveStep(index);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveStep((prev) => Math.min(prev + 1, ELECTION_STEPS.length - 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveStep((prev) => Math.max(prev - 1, 0));
    }
  }, []);

  /** Handle listen button click */
  const handleListen = useCallback(async (text: string) => {
    if (isPlaying) {
      stop();
    } else {
      try {
        await speak(text, currentLanguage);
      } catch { /* handled in hook */ }
    }
  }, [isPlaying, stop, speak, currentLanguage]);

  /** Handle Ask AI button click */
  const handleAskAi = useCallback((stepTitle: string) => {
    onAskAi(`Tell me more about: ${stepTitle}`);
  }, [onAskAi]);

  const currentStep = ELECTION_STEPS[activeStep];

  if (!currentStep) {
    return <SkeletonLoader variant="card" ariaLabel="Loading timeline..." />;
  }

  return (
    <section className="timeline" aria-label={t('timeline.title')} id="timeline-section">
      <div className="timeline__header">
        <h2 className="timeline__title">{t('timeline.title')}</h2>
        <p className="timeline__subtitle">{t('timeline.subtitle')}</p>
      </div>

      {/* Step indicators */}
      <div className="timeline__steps" role="tablist" aria-label="Election process steps">
        {ELECTION_STEPS.map((step, index) => (
          <button
            key={step.id}
            type="button"
            role="tab"
            className={`timeline__indicator ${index === activeStep ? 'timeline__indicator--active' : ''} ${index < activeStep ? 'timeline__indicator--completed' : ''}`}
            onClick={() => handleStepClick(index)}
            onKeyDown={(e) => handleStepKeyDown(e, index)}
            aria-selected={index === activeStep}
            aria-label={`Step ${step.id}: ${step.title}`}
            tabIndex={index === activeStep ? 0 : -1}
            id={`step-tab-${step.id}`}
            aria-controls={`step-panel-${step.id}`}
          >
            <span className="timeline__indicator-icon" aria-hidden="true">{step.icon}</span>
            <span className="timeline__indicator-label">{step.title}</span>
            <span className="timeline__indicator-number">{step.id}</span>
          </button>
        ))}
      </div>

      {/* Active step content */}
      <div
        className={`timeline__content ${currentStep.patternClass}`}
        role="tabpanel"
        id={`step-panel-${currentStep.id}`}
        aria-labelledby={`step-tab-${currentStep.id}`}
        key={currentStep.id}
      >
        <div className="timeline__content-header">
          <span className="timeline__content-icon" aria-hidden="true">{currentStep.icon}</span>
          <h3 className="timeline__content-title">
            <span className="timeline__step-badge">Step {currentStep.id}</span>
            {currentStep.title}
          </h3>
        </div>

        <p className="timeline__description">{currentStep.description}</p>

        {/* Action buttons */}
        <div className="timeline__actions">
          <button
            type="button"
            className="timeline__button timeline__button--listen"
            onClick={() => handleListen(currentStep.description)}
            aria-label={isPlaying ? 'Stop listening' : `Listen to ${currentStep.title} description`}
            disabled={ttsLoading}
          >
            <span aria-hidden="true">{isPlaying ? '⏹' : '🔊'}</span>
            {isPlaying ? 'Stop' : t('timeline.listen')}
          </button>

          <button
            type="button"
            className="timeline__button timeline__button--ask"
            onClick={() => handleAskAi(currentStep.title)}
            aria-label={`Ask AI about ${currentStep.title}`}
          >
            <span aria-hidden="true">✦</span>
            {t('timeline.askAi')}
          </button>
        </div>

        {/* Checklist */}
        <ul className="timeline__checklist" aria-label={`Action items for ${currentStep.title}`}>
          {currentStep.checklist.map((item) => (
            <li key={item.id} className="timeline__checklist-item">
              <span className="timeline__checklist-text">{item.text}</span>
              <a
                href={item.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="timeline__official-link"
                aria-label={item.ariaLabel}
              >
                <span className="timeline__official-badge">↗ {t('timeline.officialSite')}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Step navigation */}
        <div className="timeline__nav">
          <button
            type="button"
            className="timeline__nav-button"
            onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
            disabled={activeStep === 0}
            aria-label="Go to previous step"
          >
            ← Previous
          </button>
          <span className="timeline__nav-counter">
            {activeStep + 1} / {ELECTION_STEPS.length}
          </span>
          <button
            type="button"
            className="timeline__nav-button"
            onClick={() => setActiveStep((prev) => Math.min(prev + 1, ELECTION_STEPS.length - 1))}
            disabled={activeStep === ELECTION_STEPS.length - 1}
            aria-label="Go to next step"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
