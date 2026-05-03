/**
 * @fileoverview Validation utilities for user inputs.
 * Enforces length limits and format requirements.
 */

import { ADDRESS_MIN_LENGTH, CHAT_MAX_LENGTH, SUPPORTED_LANGUAGES } from '@/constants';
import type { LanguageCode } from '@/types';

/** Validation result with optional error message */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly error?: string;
}

/**
 * Validate an address input for the polling station finder.
 * @param address - User-entered address string
 * @returns Validation result
 */
export function validateAddress(address: string): ValidationResult {
  const trimmed = address.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Please enter your address.' };
  }
  if (trimmed.length < ADDRESS_MIN_LENGTH) {
    return { isValid: false, error: `Address must be at least ${ADDRESS_MIN_LENGTH} characters long.` };
  }
  return { isValid: true };
}

/**
 * Validate a chat message input.
 * @param message - User-entered chat message
 * @returns Validation result
 */
export function validateChatMessage(message: string): ValidationResult {
  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Please enter a message.' };
  }
  if (trimmed.length > CHAT_MAX_LENGTH) {
    return { isValid: false, error: `Message must be ${CHAT_MAX_LENGTH} characters or fewer.` };
  }
  return { isValid: true };
}

/**
 * Validate a language code against supported languages.
 * @param code - Language code to validate
 * @returns Whether the code is a supported language
 */
export function isValidLanguage(code: string): code is LanguageCode {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
}
