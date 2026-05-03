import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGemini } from '@/hooks/useGemini';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useTranslate } from '@/hooks/useTranslate';
import { useTTS } from '@/hooks/useTTS';
import { useYouTube } from '@/hooks/useYouTube';

describe('Hooks tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    import.meta.env.VITE_GEMINI_API_KEY = '';
    import.meta.env.VITE_MAPS_API_KEY = '';
    import.meta.env.VITE_TRANSLATE_API_KEY = '';
    import.meta.env.VITE_TTS_API_KEY = '';
    import.meta.env.VITE_YOUTUBE_API_KEY = '';
  });

  it('useGemini handles input correctly', async () => {
    const { result } = renderHook(() => useGemini());
    await act(async () => {
      await result.current.sendMessage('Hello');
    });
    expect(result.current.messages.length).toBeGreaterThan(1);
    act(() => result.current.resetChat());
    expect(result.current.messages.length).toBe(1);
  });

  it('useGoogleMaps validates address', async () => {
    const { result } = renderHook(() => useGoogleMaps());
    await act(async () => {
      await result.current.searchAddress('short');
    });
    expect(result.current.error).toBeTruthy();
    
    await act(async () => {
      await result.current.searchAddress('Valid Address 12345');
    });
    expect(result.current.isDemoMode).toBe(true);
  });

  it('useTranslate translates text', async () => {
    const { result } = renderHook(() => useTranslate());
    expect(result.current.t('nav.title')).toBe('SmartElect');
    act(() => result.current.setLanguage('hi'));
    await waitFor(() => {
      expect(result.current.currentLanguage).toBe('hi');
    });
  });

  it('useTTS speaks text', async () => {
    const { result } = renderHook(() => useTTS());
    await act(async () => {
      await result.current.speak('Hello');
    });
    expect(result.current.isDemoMode).toBe(true);
    act(() => result.current.stop());
  });

  it('useYouTube fetches videos', async () => {
    const { result } = renderHook(() => useYouTube());
    await act(async () => {
      await result.current.fetchVideos();
    });
    expect(result.current.videos.length).toBe(3);
    act(() => result.current.selectVideo('123'));
    expect(result.current.selectedVideoId).toBe('123');
  });
});
