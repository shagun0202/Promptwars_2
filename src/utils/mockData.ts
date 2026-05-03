/**
 * @fileoverview Realistic mock data for all 5 Google APIs.
 * Used when API keys are missing or APIs return errors (demo mode).
 */

import type { ChatMessage, GeocodingResult, PollingLocation, VideoResult } from '@/types';

/** Mock Gemini AI responses keyed by topic keywords */
export const MOCK_GEMINI_RESPONSES: Record<string, string> = {
  epic: 'The EPIC (Electors Photo Identity Card) is your official voter ID issued by the Election Commission of India. It contains your photo, name, address, and a unique voter ID number. You can apply for it through Form 6 on the NVSP portal or download the digital e-EPIC version.',
  form: 'Form 6 is the application for new voter registration. You need to fill it with your personal details, attach a passport-size photo, proof of age, and proof of address. Submit it online via the NVSP portal at voters.eci.gov.in or at your nearest Electoral Registration Office.',
  vvpat: 'VVPAT (Voter Verifiable Paper Audit Trail) is a machine attached to EVMs that prints a paper slip showing the symbol of the candidate you voted for. The slip is visible for 7 seconds through a transparent window, allowing you to verify your vote before it drops into a sealed box.',
  nri: 'Yes, NRIs can vote in Indian elections! Under the Representation of the People (Amendment) Act, 2010, NRIs who have not acquired citizenship of another country can register as overseas electors. You need to register using Form 6A on the NVSP portal.',
  default: 'Indian elections follow a robust democratic process overseen by the Election Commission of India (ECI). The ECI is an autonomous constitutional authority responsible for administering election processes. Every citizen aged 18+ can register to vote and participate in elections at various levels.',
};

/**
 * Get a mock Gemini response based on message content.
 * @param message - User message to match against
 * @returns Mock response text
 */
export function getMockGeminiResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('epic') || lower.includes('voter id')) return MOCK_GEMINI_RESPONSES['epic']!;
  if (lower.includes('form')) return MOCK_GEMINI_RESPONSES['form']!;
  if (lower.includes('vvpat') || lower.includes('paper')) return MOCK_GEMINI_RESPONSES['vvpat']!;
  if (lower.includes('nri') || lower.includes('overseas')) return MOCK_GEMINI_RESPONSES['nri']!;
  return MOCK_GEMINI_RESPONSES['default']!;
}

/** Mock geocoding result */
export const MOCK_GEOCODING_RESULT: GeocodingResult = {
  formattedAddress: 'Nirman Bhawan, Maulana Azad Rd, New Delhi, Delhi 110011, India',
  lat: 28.6139,
  lng: 77.2090,
};

/** Mock polling location */
export const MOCK_POLLING_LOCATION: PollingLocation = {
  name: 'Government Boys Senior Secondary School',
  address: 'Block A, Connaught Place, New Delhi, Delhi 110001',
  hours: '7:00 AM - 6:00 PM',
  lat: 28.6139,
  lng: 77.2090,
  electionName: 'General Election 2024 — Lok Sabha',
};

/** Mock YouTube video results */
export const MOCK_VIDEOS: readonly VideoResult[] = [
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'How to Vote in Indian Elections — Complete Guide',
    channelTitle: 'Election Commission of India',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    viewCount: '2.4M',
    viewCountRaw: 2400000,
  },
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'Understanding EVM and VVPAT Machines',
    channelTitle: 'ECI Official',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    viewCount: '1.8M',
    viewCountRaw: 1800000,
  },
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'Voter Registration Process — Step by Step',
    channelTitle: 'MyGov India',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    viewCount: '950K',
    viewCountRaw: 950000,
  },
] as const;

/** Mock translated text (returns original in demo mode) */
export function getMockTranslation(text: string): string {
  return text;
}

/** Mock TTS — returns a silent audio blob URL */
export function getMockTTSAudio(): string {
  const silence = new Uint8Array([
    0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00,
    0x57, 0x41, 0x56, 0x45, 0x66, 0x6D, 0x74, 0x20,
    0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
    0x44, 0xAC, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00,
    0x02, 0x00, 0x10, 0x00, 0x64, 0x61, 0x74, 0x61,
    0x00, 0x00, 0x00, 0x00,
  ]);
  const blob = new Blob([silence], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

/** Mock chat messages for initial display */
export const MOCK_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'model',
  content: 'Hello! I\'m SmartElect AI, your election education assistant. Ask me anything about the Indian election process, voter registration, or your democratic rights.',
  timestamp: new Date().toISOString(),
  isStreaming: false,
};
