/**
 * @fileoverview Shared TypeScript interfaces and types for the SmartElect application.
 * All type definitions used across components, hooks, and utilities are centralized here.
 */

/** Supported language codes for the translation system */
export type LanguageCode = 'en' | 'hi' | 'es' | 'fr' | 'ar' | 'zh' | 'pt' | 'sw';

/** Language configuration object */
export interface Language {
  /** ISO language code */
  readonly code: LanguageCode;
  /** Display name in native script */
  readonly name: string;
  /** Display name in English */
  readonly englishName: string;
  /** Text direction */
  readonly direction: 'ltr' | 'rtl';
}

/** A single checklist item within an election step */
export interface ChecklistItem {
  /** Unique identifier */
  readonly id: string;
  /** Display text for the checklist item */
  readonly text: string;
  /** URL to official Indian government resource */
  readonly officialUrl: string;
  /** Aria label for accessibility */
  readonly ariaLabel: string;
}

/** An individual step in the election timeline */
export interface ElectionStep {
  /** Unique step identifier (1-based) */
  readonly id: number;
  /** Step icon emoji or character */
  readonly icon: string;
  /** Step title */
  readonly title: string;
  /** India-specific explanation (3-5 sentences) */
  readonly description: string;
  /** List of actionable checklist items */
  readonly checklist: readonly ChecklistItem[];
  /** CSS class for unique background pattern */
  readonly patternClass: string;
}

/** Role in a chat conversation */
export type ChatRole = 'user' | 'model';

/** A single message in the AI chat conversation */
export interface ChatMessage {
  /** Unique message identifier */
  readonly id: string;
  /** Who sent the message */
  readonly role: ChatRole;
  /** Message content text */
  readonly content: string;
  /** ISO timestamp */
  readonly timestamp: string;
  /** Whether the message is still streaming */
  readonly isStreaming?: boolean;
}

/** Gemini API response wrapper */
export interface GeminiResponse {
  /** The generated text content */
  readonly text: string;
  /** Model identifier */
  readonly model: string;
  /** Whether the response was from mock data */
  readonly isMock: boolean;
}

/** Polling location details from Google Maps */
export interface PollingLocation {
  /** Name of the polling station */
  readonly name: string;
  /** Full street address */
  readonly address: string;
  /** Operating hours */
  readonly hours: string;
  /** Latitude coordinate */
  readonly lat: number;
  /** Longitude coordinate */
  readonly lng: number;
  /** Associated election name */
  readonly electionName: string;
}

/** Video result from YouTube Data API */
export interface VideoResult {
  /** YouTube video ID */
  readonly videoId: string;
  /** Video title */
  readonly title: string;
  /** Channel name */
  readonly channelTitle: string;
  /** Thumbnail URL */
  readonly thumbnailUrl: string;
  /** Formatted view count */
  readonly viewCount: string;
  /** Raw view count number */
  readonly viewCountRaw: number;
}

/** Font size setting for accessibility */
export type FontSize = 'small' | 'medium' | 'large';

/** Accessibility preferences stored in localStorage */
export interface AccessibilityPreferences {
  /** Current font size */
  fontSize: FontSize;
  /** Whether high contrast mode is enabled */
  highContrast: boolean;
  /** Whether dark mode is enabled */
  darkMode: boolean;
  /** Current language code */
  language: LanguageCode;
}

/** Cache entry with expiry support */
export interface CacheEntry<T> {
  /** Cached data */
  readonly data: T;
  /** Timestamp when cached */
  readonly cachedAt: number;
  /** TTL in milliseconds */
  readonly ttl: number;
}

/** Rate limit state */
export interface RateLimitState {
  /** Number of messages sent in current session */
  messageCount: number;
  /** Whether the soft warning has been shown */
  warningShown: boolean;
  /** Whether the hard limit has been reached */
  limitReached: boolean;
}

/** Translation map for UI strings */
export type TranslationMap = Record<string, string>;

/** TTS audio cache entry */
export interface TTSCacheEntry {
  /** Blob URL for the audio */
  readonly blobUrl: string;
  /** Original text that was synthesized */
  readonly text: string;
  /** Language code used */
  readonly language: LanguageCode;
}

/** Geocoding result from Google Maps API */
export interface GeocodingResult {
  /** Formatted address */
  readonly formattedAddress: string;
  /** Latitude */
  readonly lat: number;
  /** Longitude */
  readonly lng: number;
}

/** Demo mode banner state */
export interface DemoModeState {
  /** Whether demo mode is active */
  readonly isActive: boolean;
  /** Which APIs are in demo mode */
  readonly demoApis: readonly string[];
}
