import { describe, it, expect, vi } from 'vitest';
import { logger } from '@/utils/logger';
import { cacheSet, cacheGet, cacheRemove } from '@/utils/cache';
import { sanitizeInput, sanitizeForDisplay, stripHtml } from '@/utils/sanitize';
import { validateAddress, validateChatMessage, isValidLanguage } from '@/utils/validate';
import { checkRateLimit, createRateLimitState, resetRateLimit } from '@/utils/rateLimit';
import { getMockGeminiResponse, getMockTranslation, getMockTTSAudio } from '@/utils/mockData';
import { renderHook, act } from '@testing-library/react';
import { useGemini } from '@/hooks/useGemini';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useTranslate } from '@/hooks/useTranslate';
import { useTTS } from '@/hooks/useTTS';
import { useYouTube } from '@/hooks/useYouTube';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Enable global fetch mock
globalThis.fetch = vi.fn() as any;

describe('Coverage tests', () => {
  it('logger', () => {
    logger.info('test');
    logger.warn('test');
    logger.debug('test');
    logger.error('test', new Error('test'));
  });

  it('cache', () => {
    cacheSet('test', 'data');
    cacheGet('test');
    cacheGet('non-existent');
    cacheSet('test-key', { data: 1 });
    expect(cacheGet('test-key')).toEqual({ data: 1 });
    cacheRemove('test-key');
    expect(cacheGet('test-key')).toBeNull();
  });

  it('sanitize', () => {
    expect(sanitizeInput('<script>')).toBe('&lt;script&gt;');
    expect(sanitizeForDisplay('&lt;script&gt;')).toBe('<script>');
    expect(stripHtml('<b>test</b>')).toBe('test');
  });

  it('validate', () => {
    expect(validateAddress('').isValid).toBe(false);
    expect(validateAddress('short').isValid).toBe(false);
    expect(validateAddress('valid long address here').isValid).toBe(true);

    expect(validateChatMessage('').isValid).toBe(false);
    expect(validateChatMessage('a'.repeat(600)).isValid).toBe(false);
    expect(validateChatMessage('hello').isValid).toBe(true);

    expect(isValidLanguage('en')).toBe(true);
    expect(isValidLanguage('invalid')).toBe(false);
  });

  it('rateLimit', () => {
    let state = createRateLimitState();
    expect(state.messageCount).toBe(0);
    state = resetRateLimit();
    for(let i=0; i<10; i++) {
        const res = checkRateLimit(state);
        state = res.newState;
    }
    expect(checkRateLimit(state).allowed).toBe(false);
  });

  it('mockData', () => {
    expect(getMockGeminiResponse('epic')).toContain('EPIC');
    expect(getMockGeminiResponse('form')).toContain('Form 6');
    expect(getMockGeminiResponse('vvpat')).toContain('VVPAT');
    expect(getMockGeminiResponse('nri')).toContain('NRI');
    expect(getMockTranslation('test')).toBe('test');
    expect(getMockTTSAudio()).toContain('blob:');
  });

  it('ErrorBoundary fallback', () => {
    const ThrowError = () => { throw new Error('Test error'); };
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary sectionName="TestSection">
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/TestSection section encountered an error/i)).toBeInTheDocument();
    consoleError.mockRestore();
  });

  it('hooks with API keys', async () => {
    try {
    import.meta.env.VITE_GEMINI_API_KEY = 'test';
    import.meta.env.VITE_MAPS_API_KEY = 'test';
    import.meta.env.VITE_TRANSLATE_API_KEY = 'test';
    import.meta.env.VITE_TTS_API_KEY = 'test';
    import.meta.env.VITE_YOUTUBE_API_KEY = 'test';

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'OK',
        results: [{ formatted_address: 'Address', geometry: { location: { lat: 1, lng: 1 } } }],
        items: [{ id: { videoId: '1' }, snippet: { title: 't', channelTitle: 'c', thumbnails: { medium: { url: 'u' } } }, statistics: { viewCount: '100' } }],
        data: { translations: [{ translatedText: 'translated' }] },
        audioContent: 'YmFzZTY0' // valid base64
      })
    });



    // Translate
    const tHook = renderHook(() => useTranslate());
    await act(async () => {
        tHook.result.current.setLanguage('hi');
    });

    // Maps
    const mHook = renderHook(() => useGoogleMaps());
    await act(async () => {
        await mHook.result.current.searchAddress('Valid Address 123');
    });

    // YouTube
    const yHook = renderHook(() => useYouTube());
    await act(async () => {
        await yHook.result.current.fetchVideos();
    });

    // TTS
    const ttsHook = renderHook(() => useTTS());
    await act(async () => {
        await ttsHook.result.current.speak('test');
    });

    // Gemini
    const gHook = renderHook(() => useGemini());
    await act(async () => {
        // Will throw internally due to mock but catch error
        await gHook.result.current.sendMessage('test message');
    });
    } finally {
      import.meta.env.VITE_GEMINI_API_KEY = '';
      import.meta.env.VITE_MAPS_API_KEY = '';
      import.meta.env.VITE_TRANSLATE_API_KEY = '';
      import.meta.env.VITE_TTS_API_KEY = '';
      import.meta.env.VITE_YOUTUBE_API_KEY = '';
      (globalThis.fetch as any).mockRestore();
    }
  });
});
