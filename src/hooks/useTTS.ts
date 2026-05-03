/**
 * @fileoverview Custom hook for Google Cloud Text-to-Speech API.
 * Provides audio synthesis with caching to prevent re-fetching.
 */

import { useState, useCallback, useRef } from 'react';
import type { LanguageCode } from '@/types';
import { API_ENDPOINTS, TTS_LANGUAGE_MAP, DEFAULT_LANGUAGE } from '@/constants';
import { getMockTTSAudio } from '@/utils/mockData';
import { logger } from '@/utils/logger';

/** Return type of useTTS hook */
export interface UseTTSReturn {
  readonly isPlaying: boolean;
  readonly isLoading: boolean;
  readonly isDemoMode: boolean;
  readonly speak: (text: string, language?: LanguageCode) => Promise<void>;
  readonly stop: () => void;
}

/**
 * Hook for Google Cloud Text-to-Speech with blob URL caching.
 * @returns TTS state and methods
 */
export function useTTS(): UseTTSReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());

  const apiKey = import.meta.env['VITE_TTS_API_KEY'] as string | undefined;

  /** Stop audio playback */
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  /** Play audio from a blob URL */
  const playAudio = useCallback((url: string) => {
    const audio = new Audio(url);
    audioRef.current = audio;
    setIsPlaying(true);

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    audio.addEventListener('error', () => {
      setIsPlaying(false);
      logger.error('Audio playback error');
    });

    audio.play().catch((err) => {
      logger.error('Audio play failed', err);
      setIsPlaying(false);
    });
  }, []);

  /** Speak the given text using TTS */
  const speak = useCallback(async (text: string, language: LanguageCode = DEFAULT_LANGUAGE): Promise<void> => {
    if (isPlaying) {
      stop();
    }

    const cacheKey = `${language}-${text}`;
    const cachedUrl = cacheRef.current.get(cacheKey);

    if (cachedUrl) {
      playAudio(cachedUrl);
      return;
    }

    setIsLoading(true);

    try {
      if (!apiKey) {
        const mockUrl = getMockTTSAudio();
        cacheRef.current.set(cacheKey, mockUrl);
        playAudio(mockUrl);
        setIsDemoMode(true);
        return;
      }

      const langCode = TTS_LANGUAGE_MAP[language] ?? TTS_LANGUAGE_MAP[DEFAULT_LANGUAGE];
      const response = await fetch(`${API_ENDPOINTS.TTS_SYNTHESIZE}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: text.substring(0, 5000) },
          voice: { languageCode: langCode, ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'MP3' },
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const data = await response.json() as { audioContent: string };
      const audioBytes = Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0));
      const blob = new Blob([audioBytes], { type: 'audio/mp3' });
      const blobUrl = URL.createObjectURL(blob);

      cacheRef.current.set(cacheKey, blobUrl);
      playAudio(blobUrl);
    } catch (err) {
      logger.error('TTS error', err);
      setIsDemoMode(true);
      const mockUrl = getMockTTSAudio();
      cacheRef.current.set(cacheKey, mockUrl);
      playAudio(mockUrl);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, isPlaying, playAudio, stop]);

  return { isPlaying, isLoading, isDemoMode, speak, stop };
}
