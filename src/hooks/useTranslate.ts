/**
 * @fileoverview Custom hook for Google Cloud Translation API.
 * Translates UI text strings with debouncing and caching.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { LanguageCode, TranslationMap } from '@/types';
import { API_ENDPOINTS, DEFAULT_LANGUAGE, TRANSLATE_DEBOUNCE_MS, UI_TEXT } from '@/constants';
import { cacheGet, cacheSet } from '@/utils/cache';
import { getMockTranslation } from '@/utils/mockData';
import { logger } from '@/utils/logger';

/** Return type of useTranslate hook */
export interface UseTranslateReturn {
  readonly translations: TranslationMap;
  readonly currentLanguage: LanguageCode;
  readonly isLoading: boolean;
  readonly isDemoMode: boolean;
  readonly setLanguage: (lang: LanguageCode) => void;
  readonly t: (key: string) => string;
}

/**
 * Hook for Google Cloud Translation with debouncing and caching.
 * @returns Translation state and methods
 */
export function useTranslate(): UseTranslateReturn {
  const [translations, setTranslations] = useState<TranslationMap>(UI_TEXT);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apiKey = import.meta.env['VITE_TRANSLATE_API_KEY'] as string | undefined;

  /** Translate all UI text to the target language */
  const translateAll = useCallback(async (targetLang: LanguageCode): Promise<void> => {
    if (targetLang === DEFAULT_LANGUAGE) {
      setTranslations(UI_TEXT);
      return;
    }

    const cacheKey = `translate-${targetLang}`;
    const cached = cacheGet<TranslationMap>(cacheKey);
    if (cached) {
      setTranslations(cached);
      return;
    }

    setIsLoading(true);

    try {
      if (!apiKey) {
        const mock: TranslationMap = {};
        for (const [key, value] of Object.entries(UI_TEXT)) {
          mock[key] = getMockTranslation(value);
        }
        setTranslations(mock);
        setIsDemoMode(true);
        return;
      }

      const texts = Object.values(UI_TEXT);
      const response = await fetch(`${API_ENDPOINTS.TRANSLATE}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: texts, target: targetLang, source: 'en', format: 'text' }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json() as {
        data: { translations: Array<{ translatedText: string }> };
      };

      const keys = Object.keys(UI_TEXT);
      const translated: TranslationMap = {};
      data.data.translations.forEach((t, i) => {
        const key = keys[i];
        if (key) {
          translated[key] = t.translatedText;
        }
      });

      setTranslations(translated);
      cacheSet(cacheKey, translated);
    } catch (err) {
      logger.error('Translation error', err);
      setIsDemoMode(true);
      setTranslations(UI_TEXT);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  /** Set language with debounce */
  const setLanguage = useCallback((lang: LanguageCode) => {
    setCurrentLanguage(lang);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      translateAll(lang).catch((err) => logger.error('Translation failed', err));
    }, TRANSLATE_DEBOUNCE_MS);
  }, [translateAll]);

  /** Get translated text by key */
  const t = useCallback((key: string): string => {
    return translations[key] ?? UI_TEXT[key] ?? key;
  }, [translations]);

  /** Cleanup debounce timer */
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return { translations, currentLanguage, isLoading, isDemoMode, setLanguage, t };
}
