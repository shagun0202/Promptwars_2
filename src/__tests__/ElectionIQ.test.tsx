import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '@/App';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { useGemini } from '@/hooks/useGemini';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useTTS } from '@/hooks/useTTS';
import { useYouTube } from '@/hooks/useYouTube';
import { useTranslate } from '@/hooks/useTranslate';

// Mock the hooks to control API responses during testing
vi.mock('@/hooks/useGemini', () => ({
  useGemini: vi.fn(),
}));
vi.mock('@/hooks/useGoogleMaps', () => ({
  useGoogleMaps: vi.fn(),
}));
vi.mock('@/hooks/useTTS', () => ({
  useTTS: vi.fn(),
}));
vi.mock('@/hooks/useYouTube', () => ({
  useYouTube: vi.fn(),
}));
vi.mock('@/hooks/useTranslate', () => ({
  useTranslate: vi.fn(),
}));

describe('SmartElect Application', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    (useGemini as any).mockReturnValue({
      messages: [{ id: '1', role: 'model', content: 'Hello' }],
      isLoading: false,
      error: null,
      isDemoMode: true,
      rateLimitState: { limitReached: false, messageCount: 0, warningShown: false },
      sendMessage: vi.fn(async () => {}),
      resetChat: vi.fn(),
    });

    (useGoogleMaps as any).mockReturnValue({
      pollingLocation: null,
      embedUrl: null,
      directionsUrl: null,
      isLoading: false,
      error: null,
      isDemoMode: true,
      searchAddress: vi.fn(async () => {}),
    });

    (useTTS as any).mockReturnValue({
      isPlaying: false,
      isLoading: false,
      isDemoMode: true,
      speak: vi.fn(async () => {}),
      stop: vi.fn(),
    });

    (useYouTube as any).mockReturnValue({
      videos: [],
      isLoading: false,
      error: null,
      isDemoMode: true,
      selectedVideoId: null,
      fetchVideos: vi.fn(async () => {}),
      selectVideo: vi.fn(),
    });

    (useTranslate as any).mockReturnValue({
      translations: {},
      currentLanguage: 'en',
      isLoading: false,
      isDemoMode: true,
      setLanguage: vi.fn(),
      t: (key: string) => key,
    });
  });

  const renderApp = () => render(
    <TranslationProvider>
      <App />
    </TranslationProvider>
  );

  it('renders the main application header', () => {
    renderApp();
    expect(screen.getByText('SmartElect')).toBeInTheDocument();
  });

  it('allows address form submission in Polling Finder', async () => {
    const searchAddressMock = vi.fn();
    (useGoogleMaps as any).mockReturnValue({
      pollingLocation: null,
      embedUrl: null,
      directionsUrl: null,
      isLoading: false,
      error: null,
      isDemoMode: true,
      searchAddress: searchAddressMock,
    });

    renderApp();
    
    const input = screen.getByPlaceholderText('polling.placeholder');
    const button = screen.getByRole('button', { name: 'polling.search' });
    
    // Invalid address
    fireEvent.change(input, { target: { value: 'short' } });
    expect(button).toBeDisabled();

    // Valid address
    fireEvent.change(input, { target: { value: 'Valid Address Here' } });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);
    await waitFor(() => {
      expect(searchAddressMock).toHaveBeenCalledWith('Valid Address Here');
    });
  });

  it('opens and interacts with the AI Chat Assistant', async () => {
    const sendMessageMock = vi.fn();
    (useGemini as any).mockReturnValue({
      messages: [{ id: 'welcome', role: 'model', content: 'Welcome to SmartElect' }],
      isLoading: false,
      error: null,
      isDemoMode: true,
      rateLimitState: { limitReached: false, messageCount: 0, warningShown: false },
      sendMessage: sendMessageMock,
      resetChat: vi.fn(),
    });

    renderApp();
    
    // Toggle chat
    const toggleButton = screen.getByRole('button', { name: 'Open AI assistant' });
    fireEvent.click(toggleButton);

    const input = screen.getByPlaceholderText('chat.placeholder');
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    
    const sendButton = screen.getByRole('button', { name: 'chat.send' });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(sendMessageMock).toHaveBeenCalledWith('Hello AI');
    });
  });

  it('triggers TTS when listen button is clicked in timeline', () => {
    const speakMock = vi.fn();
    (useTTS as any).mockReturnValue({
      isPlaying: false,
      isLoading: false,
      isDemoMode: true,
      speak: speakMock,
      stop: vi.fn(),
    });

    renderApp();
    
    // Listen button on first step
    const listenButtons = screen.getAllByRole('button', { name: /Listen to/i });
    expect(listenButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(listenButtons[0]!);
    expect(speakMock).toHaveBeenCalled();
  });
  
  it('changes active step in Timeline on navigation', () => {
    renderApp();
    
    const nextButton = screen.getByRole('button', { name: 'Go to next step' });
    fireEvent.click(nextButton);
    
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    
    const prevButton = screen.getByRole('button', { name: 'Go to previous step' });
    fireEvent.click(prevButton);
    
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });
});
