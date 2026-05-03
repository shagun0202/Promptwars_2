/**
 * @fileoverview Accessibility bar component.
 * Provides language selection, font size, contrast, dark mode, and read-page controls.
 */

import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useTTS } from '@/hooks/useTTS';
import { SUPPORTED_LANGUAGES, FONT_SIZES, STORAGE_KEY_PREFERENCES } from '@/constants';
import type { FontSize, AccessibilityPreferences, LanguageCode } from '@/types';
import { logger } from '@/utils/logger';

/**
 * Accessibility toolbar at the top of the page.
 * Controls language, font size, high contrast, dark mode, and TTS.
 * @returns Accessibility bar JSX
 */
export function AccessibilityBar(): JSX.Element {
  const { t, setLanguage, currentLanguage } = useTranslation();
  const { speak, stop, isPlaying } = useTTS();

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFERENCES);
      return saved ? (JSON.parse(saved) as AccessibilityPreferences).fontSize : 'medium';
    } catch { return 'medium'; }
  });
  const [highContrast, setHighContrast] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFERENCES);
      return saved ? (JSON.parse(saved) as AccessibilityPreferences).highContrast : false;
    } catch { return false; }
  });
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFERENCES);
      return saved ? (JSON.parse(saved) as AccessibilityPreferences).darkMode : false;
    } catch { return false; }
  });

  /** Sync language from preferences on mount if needed */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFERENCES);
      if (saved) {
        const prefs = JSON.parse(saved) as AccessibilityPreferences;
        if (prefs.language && prefs.language !== currentLanguage) {
          setLanguage(prefs.language);
        }
      }
    } catch (err) {
      logger.warn('Failed to load language pref', err);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** Save preferences whenever they change */
  useEffect(() => {
    const prefs: AccessibilityPreferences = { fontSize, highContrast, darkMode, language: currentLanguage };
    try {
      localStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(prefs));
    } catch (err) {
      logger.warn('Failed to save preferences', err);
    }
  }, [fontSize, highContrast, darkMode, currentLanguage]);

  /** Apply visual preferences to document */
  useEffect(() => {
    const root = document.documentElement;
    const size = FONT_SIZES[fontSize] ?? '1';
    root.style.setProperty('--smartelect-font-size', `${size}rem`);
    root.classList.toggle('high-contrast', highContrast);
    root.classList.toggle('dark-mode', darkMode);
  }, [fontSize, highContrast, darkMode]);

  /** Handle language change */
  const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as LanguageCode);
  }, [setLanguage]);

  /** Cycle font size */
  const handleFontSizeToggle = useCallback(() => {
    setFontSize((prev) => {
      const sizes: FontSize[] = ['small', 'medium', 'large'];
      const idx = sizes.indexOf(prev);
      return sizes[(idx + 1) % sizes.length] ?? 'medium';
    });
  }, []);

  /** Toggle high contrast */
  const handleContrastToggle = useCallback(() => {
    setHighContrast((prev) => !prev);
  }, []);

  /** Toggle dark mode */
  const handleDarkModeToggle = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  /** Read the current page section */
  const handleReadPage = useCallback(() => {
    if (isPlaying) {
      stop();
      return;
    }
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      const text = mainContent.textContent ?? '';
      speak(text.substring(0, 3000), currentLanguage).catch((err) =>
        logger.error('Read page failed', err)
      );
    }
  }, [isPlaying, stop, speak, currentLanguage]);

  return (
    <nav className="a11y-bar" role="toolbar" aria-label="Accessibility controls">
      <div className="a11y-bar__inner">
        <div className="a11y-bar__group">
          <label htmlFor="language-select" className="a11y-bar__label">
            {t('a11y.language')}
          </label>
          <select
            id="language-select"
            className="a11y-bar__select"
            value={currentLanguage}
            onChange={handleLanguageChange}
            aria-label="Select language"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="a11y-bar__group">
          <button
            type="button"
            className="a11y-bar__button"
            onClick={handleFontSizeToggle}
            aria-label={`Font size: ${fontSize}. Click to change.`}
            title={t('a11y.fontSize')}
          >
            <span aria-hidden="true">A</span>
            <span className="a11y-bar__badge">{fontSize.charAt(0).toUpperCase()}</span>
          </button>

          <button
            type="button"
            className={`a11y-bar__button ${highContrast ? 'a11y-bar__button--active' : ''}`}
            onClick={handleContrastToggle}
            aria-label={`High contrast: ${highContrast ? 'on' : 'off'}`}
            aria-pressed={highContrast}
            title={t('a11y.highContrast')}
          >
            <span aria-hidden="true">◐</span>
          </button>

          <button
            type="button"
            className={`a11y-bar__button ${darkMode ? 'a11y-bar__button--active' : ''}`}
            onClick={handleDarkModeToggle}
            aria-label={`Dark mode: ${darkMode ? 'on' : 'off'}`}
            aria-pressed={darkMode}
            title={t('a11y.darkMode')}
          >
            <span aria-hidden="true">{darkMode ? '☀️' : '🌙'}</span>
          </button>

          <button
            type="button"
            className={`a11y-bar__button ${isPlaying ? 'a11y-bar__button--active' : ''}`}
            onClick={handleReadPage}
            aria-label={isPlaying ? 'Stop reading page' : 'Read current page aloud'}
            title={t('a11y.readPage')}
          >
            <span aria-hidden="true">{isPlaying ? '⏹' : '🔊'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
