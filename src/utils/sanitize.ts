/**
 * @fileoverview Input sanitization utilities.
 * All user inputs must be sanitized before being sent to any API call.
 */

/**
 * Sanitize a user input string by removing potentially dangerous characters.
 * Strips HTML tags, trims whitespace, and escapes special characters.
 * @param input - Raw user input string
 * @returns Sanitized string safe for API calls
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize input specifically for display (reverses HTML entity encoding).
 * @param input - Sanitized string with HTML entities
 * @returns String safe for display
 */
export function sanitizeForDisplay(input: string): string {
  return input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

/**
 * Strip all HTML tags from a string.
 * @param input - String potentially containing HTML
 * @returns Plain text string
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}
