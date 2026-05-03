/**
 * @fileoverview All application constants, magic strings, and configuration values.
 * Nothing should be hardcoded inline — all values come from here.
 */

import type { ElectionStep, Language, LanguageCode } from '@/types';

/** Application name */
export const APP_NAME = 'SmartElect' as const;

/** Application tagline */
export const APP_TAGLINE = 'Your AI-Powered Election Education Platform' as const;

/** Gemini model identifier */
export const GEMINI_MODEL = 'gemini-flash-latest' as const;

/** Maximum output tokens for Gemini responses */
export const GEMINI_MAX_TOKENS = 300 as const;

/** Maximum conversation turns to keep in Gemini history */
export const GEMINI_MAX_TURNS = 5 as const;

/** Maximum chat messages per session */
export const CHAT_RATE_LIMIT = 10 as const;

/** Soft warning threshold for chat messages */
export const CHAT_SOFT_WARNING = 8 as const;

/** Maximum character length for chat input */
export const CHAT_MAX_LENGTH = 500 as const;

/** Minimum character length for address input */
export const ADDRESS_MIN_LENGTH = 10 as const;

/** Debounce delay for translation API calls (ms) */
export const TRANSLATE_DEBOUNCE_MS = 500 as const;

/** Session storage cache TTL (ms) — 30 minutes */
export const CACHE_TTL_MS = 1_800_000 as const;

/** Local storage key for accessibility preferences */
export const STORAGE_KEY_PREFERENCES = 'smartelect-preferences' as const;

/** Local storage key for dark mode */
export const STORAGE_KEY_DARK_MODE = 'smartelect-dark-mode' as const;

/** CSS custom property names */
export const CSS_VARS = {
  FONT_SIZE: '--smartelect-font-size',
  FONT_SIZE_SMALL: '--smartelect-font-size-small',
} as const;

/** Font size values in rem */
export const FONT_SIZES: Record<string, string> = {
  small: '0.875',
  medium: '1',
  large: '1.25',
} as const;

/** Color palette */
export const COLORS = {
  NAVY: '#0A1628',
  WHITE: '#F8F6F0',
  GOLD: '#C9A84C',
  GREEN: '#2D6A4F',
  ERROR: '#D32F2F',
  WARNING: '#F9A825',
  INFO: '#1976D2',
} as const;

/** Gemini system instruction for election education context */
export const GEMINI_SYSTEM_INSTRUCTION = `You are SmartElect AI, an expert election education assistant focused on Indian elections. You help citizens understand the voting process, election rules, and their democratic rights. Provide detailed, multi-sentence answers (about 3-5 sentences or bullet points) that are highly educational and informative. Always recommend verifying information with the Election Commission of India (ECI) at eci.gov.in. Never provide partisan political advice or endorse any candidate or party. Focus on process, rights, and civic education.` as const;

/** Suggested questions for the AI chat */
export const SUGGESTED_QUESTIONS: readonly string[] = [
  'What is an EPIC card?',
  'How do I fill Form 6?',
  'What is VVPAT?',
  'Can NRIs vote?',
] as const;

/** Chat disclaimer text */
export const CHAT_DISCLAIMER = 'For educational purposes only. Always verify with your official election authority.' as const;

/** Demo mode banner text */
export const DEMO_BANNER_TEXT = 'Running in demo mode — responses are illustrative' as const;

/** Supported languages */
export const SUPPORTED_LANGUAGES: readonly Language[] = [
  { code: 'en', name: 'English', englishName: 'English', direction: 'ltr' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', direction: 'ltr' },
  { code: 'es', name: 'Español', englishName: 'Spanish', direction: 'ltr' },
  { code: 'fr', name: 'Français', englishName: 'French', direction: 'ltr' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic', direction: 'rtl' },
  { code: 'zh', name: '中文', englishName: 'Mandarin', direction: 'ltr' },
  { code: 'pt', name: 'Português', englishName: 'Portuguese', direction: 'ltr' },
  { code: 'sw', name: 'Kiswahili', englishName: 'Swahili', direction: 'ltr' },
] as const;

/** Default language */
export const DEFAULT_LANGUAGE: LanguageCode = 'en' as const;

/** YouTube search query for election education */
export const YOUTUBE_SEARCH_QUERY = 'Indian election education voter awareness official' as const;

/** YouTube maximum results */
export const YOUTUBE_MAX_RESULTS = 3 as const;

/** Official Indian government URLs */
export const OFFICIAL_URLS = {
  VOTER_GUIDE: 'https://eci.gov.in/voter/voters-guide',
  VOTER_REGISTRATION: 'https://voters.eci.gov.in/login',
  BOOTH_SEARCH: 'https://voters.eci.gov.in/booth-search',
  E_EPIC: 'https://voters.eci.gov.in/e-epic',
  AFFIDAVITS: 'https://affidavit.eci.gov.in',
  RESULTS: 'https://results.eci.gov.in',
} as const;

/** Election timeline steps */
export const ELECTION_STEPS: readonly ElectionStep[] = [
  {
    id: 1,
    icon: '✓',
    title: 'Check Eligibility',
    description:
      'Every Indian citizen aged 18 or above on the qualifying date is eligible to vote. You must be a resident of the constituency where you wish to vote and should not be disqualified under any law. The Election Commission of India (ECI) maintains the electoral roll, which is the official list of eligible voters. You can check your name on the electoral roll online through the National Voters\' Service Portal (NVSP).',
    checklist: [
      {
        id: 'elig-1',
        text: 'Verify you are 18+ years of age on the qualifying date',
        officialUrl: OFFICIAL_URLS.VOTER_GUIDE,
        ariaLabel: 'Visit official source for voter eligibility guide',
      },
      {
        id: 'elig-2',
        text: 'Check your name on the electoral roll via NVSP',
        officialUrl: OFFICIAL_URLS.VOTER_GUIDE,
        ariaLabel: 'Visit official source for electoral roll check',
      },
      {
        id: 'elig-3',
        text: 'Ensure you have valid identity proof (Aadhaar, PAN, etc.)',
        officialUrl: OFFICIAL_URLS.VOTER_GUIDE,
        ariaLabel: 'Visit official source for identity proof requirements',
      },
    ],
    patternClass: 'timeline__step--pattern-dots',
  },
  {
    id: 2,
    icon: '📋',
    title: 'Register to Vote',
    description:
      'To register as a new voter, you must fill Form 6 and submit it online through the NVSP portal or at the nearest Electoral Registration Office. You will need a recent passport-size photograph, proof of age, and proof of address. Once registered, you receive an Elector\'s Photo Identity Card (EPIC), also known as the Voter ID card. You can also download the e-EPIC, a digital version of your voter ID.',
    checklist: [
      {
        id: 'reg-1',
        text: 'Fill and submit Form 6 online via NVSP',
        officialUrl: OFFICIAL_URLS.VOTER_REGISTRATION,
        ariaLabel: 'Visit official source for voter registration',
      },
      {
        id: 'reg-2',
        text: 'Upload passport-size photo and address proof',
        officialUrl: OFFICIAL_URLS.VOTER_REGISTRATION,
        ariaLabel: 'Visit official source for document upload',
      },
      {
        id: 'reg-3',
        text: 'Download your e-EPIC (digital voter ID)',
        officialUrl: OFFICIAL_URLS.E_EPIC,
        ariaLabel: 'Visit official source for e-EPIC download',
      },
    ],
    patternClass: 'timeline__step--pattern-lines',
  },
  {
    id: 3,
    icon: '📍',
    title: 'Find Polling Place',
    description:
      'Your polling station is assigned based on your residential address as registered in the electoral roll. The ECI provides a booth search facility on the NVSP portal where you can find your designated polling station. On election day, polling stations are open from 7:00 AM to 6:00 PM in most constituencies. It is advisable to visit early to avoid long queues.',
    checklist: [
      {
        id: 'poll-1',
        text: 'Search your booth on the NVSP Booth Search portal',
        officialUrl: OFFICIAL_URLS.BOOTH_SEARCH,
        ariaLabel: 'Visit official source for booth search',
      },
      {
        id: 'poll-2',
        text: 'Note your polling station address and booth number',
        officialUrl: OFFICIAL_URLS.BOOTH_SEARCH,
        ariaLabel: 'Visit official source for polling station details',
      },
      {
        id: 'poll-3',
        text: 'Plan your route and arrive early on election day',
        officialUrl: OFFICIAL_URLS.BOOTH_SEARCH,
        ariaLabel: 'Visit official source for election day guidance',
      },
    ],
    patternClass: 'timeline__step--pattern-grid',
  },
  {
    id: 4,
    icon: '📄',
    title: 'Learn the Ballot',
    description:
      'India uses Electronic Voting Machines (EVMs) along with Voter Verifiable Paper Audit Trail (VVPAT) machines. Each EVM displays candidate names, party symbols, and a button to cast your vote. The VVPAT prints a slip showing the symbol you voted for, visible for 7 seconds. Understanding the ballot layout and the candidates in your constituency helps you make an informed choice.',
    checklist: [
      {
        id: 'ballot-1',
        text: 'Review candidate affidavits and backgrounds',
        officialUrl: OFFICIAL_URLS.AFFIDAVITS,
        ariaLabel: 'Visit official source for candidate affidavits',
      },
      {
        id: 'ballot-2',
        text: 'Understand how EVMs and VVPAT machines work',
        officialUrl: OFFICIAL_URLS.VOTER_GUIDE,
        ariaLabel: 'Visit official source for EVM guide',
      },
      {
        id: 'ballot-3',
        text: 'Learn about NOTA (None of the Above) option',
        officialUrl: OFFICIAL_URLS.VOTER_GUIDE,
        ariaLabel: 'Visit official source for NOTA information',
      },
    ],
    patternClass: 'timeline__step--pattern-cross',
  },
  {
    id: 5,
    icon: '🗳️',
    title: 'Cast Your Vote',
    description:
      'On election day, carry your EPIC or any ECI-approved photo ID to the polling station. After identity verification, you will receive indelible ink on your finger and be directed to the EVM. Press the button next to your preferred candidate to cast your vote. The VVPAT machine will display a printed slip for verification. Your vote is secret and protected by law.',
    checklist: [
      {
        id: 'cast-1',
        text: 'Carry your EPIC or approved photo ID to the booth',
        officialUrl: OFFICIAL_URLS.VOTER_GUIDE,
        ariaLabel: 'Visit official source for voting day requirements',
      },
      {
        id: 'cast-2',
        text: 'Verify your VVPAT slip after pressing the EVM button',
        officialUrl: OFFICIAL_URLS.VOTER_GUIDE,
        ariaLabel: 'Visit official source for VVPAT verification',
      },
      {
        id: 'cast-3',
        text: 'Report any irregularities to the presiding officer',
        officialUrl: OFFICIAL_URLS.VOTER_GUIDE,
        ariaLabel: 'Visit official source for reporting issues',
      },
    ],
    patternClass: 'timeline__step--pattern-wave',
  },
  {
    id: 6,
    icon: '📊',
    title: 'Understand Results',
    description:
      'After voting concludes, EVMs are sealed and stored securely until counting day. Counting is conducted under strict supervision with candidates\' agents present. Results are declared constituency by constituency and published on the ECI results portal. The candidate with the most votes in each constituency wins the seat. Understanding the first-past-the-post system helps you follow the results effectively.',
    checklist: [
      {
        id: 'result-1',
        text: 'Follow live results on the ECI results portal',
        officialUrl: OFFICIAL_URLS.RESULTS,
        ariaLabel: 'Visit official source for election results',
      },
      {
        id: 'result-2',
        text: 'Understand the first-past-the-post counting system',
        officialUrl: OFFICIAL_URLS.RESULTS,
        ariaLabel: 'Visit official source for counting system',
      },
      {
        id: 'result-3',
        text: 'Learn about post-election processes and government formation',
        officialUrl: OFFICIAL_URLS.RESULTS,
        ariaLabel: 'Visit official source for post-election process',
      },
    ],
    patternClass: 'timeline__step--pattern-diamond',
  },
] as const;

/** API endpoint URLs */
export const API_ENDPOINTS = {
  GEOCODING: 'https://maps.googleapis.com/maps/api/geocode/json',
  MAPS_EMBED: 'https://www.google.com/maps/embed/v1/place',
  YOUTUBE_SEARCH: 'https://www.googleapis.com/youtube/v3/search',
  YOUTUBE_VIDEOS: 'https://www.googleapis.com/youtube/v3/videos',
  TTS_SYNTHESIZE: 'https://texttospeech.googleapis.com/v1/text:synthesize',
  TRANSLATE: 'https://translation.googleapis.com/language/translate/v2',
} as const;

/** Google Maps directions base URL */
export const MAPS_DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1' as const;

/** UI text strings (English defaults — translated via Translation API) */
export const UI_TEXT: Record<string, string> = {
  'nav.title': 'SmartElect',
  'nav.tagline': 'Your AI-Powered Election Education Platform',
  'timeline.title': 'Your Election Journey',
  'timeline.subtitle': 'Follow these steps to exercise your democratic right',
  'timeline.listen': 'Listen',
  'timeline.askAi': 'Ask AI about this step',
  'timeline.officialSite': 'Official Site',
  'chat.title': 'SmartElect AI Assistant',
  'chat.placeholder': 'Ask about elections...',
  'chat.send': 'Send',
  'chat.reset': 'Reset Chat',
  'chat.powered': 'Powered by Gemini ✦',
  'chat.disclaimer': CHAT_DISCLAIMER,
  'chat.rateWarning': 'You have 2 messages remaining in this session.',
  'chat.rateLimited': 'You have reached the message limit for this session.',
  'polling.title': 'Find Your Polling Station',
  'polling.subtitle': 'Enter your registered address to locate your booth',
  'polling.placeholder': 'Enter your full registered address (min 10 characters)',
  'polling.search': 'Find Station',
  'polling.directions': 'Get Directions',
  'polling.hours': 'Hours',
  'video.title': 'Video Learning Hub',
  'video.subtitle': 'Official election education videos',
  'video.views': 'views',
  'video.loading': 'Loading videos...',
  'a11y.skipToContent': 'Skip to main content',
  'a11y.language': 'Language',
  'a11y.fontSize': 'Font Size',
  'a11y.highContrast': 'High Contrast',
  'a11y.darkMode': 'Dark Mode',
  'a11y.readPage': 'Read Page',
  'error.title': 'Something went wrong',
  'error.retry': 'Try Again',
  'error.boundary': 'This section encountered an error. Please try again.',
  'demo.banner': DEMO_BANNER_TEXT,
} as const;

/** TTS language code mapping */
export const TTS_LANGUAGE_MAP: Record<LanguageCode, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  ar: 'ar-XA',
  zh: 'cmn-CN',
  pt: 'pt-BR',
  sw: 'sw-KE',
} as const;
