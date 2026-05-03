/**
 * @fileoverview Rate limiting utility for chat messages.
 */

import { CHAT_RATE_LIMIT, CHAT_SOFT_WARNING } from '@/constants';
import type { RateLimitState } from '@/types';

/**
 * Create a new rate limit state.
 * @returns Fresh rate limit state
 */
export function createRateLimitState(): RateLimitState {
  return { messageCount: 0, warningShown: false, limitReached: false };
}

/**
 * Check and update rate limit state.
 * @param state - Current rate limit state
 * @returns Updated state and status flags
 */
export function checkRateLimit(state: RateLimitState): {
  newState: RateLimitState;
  allowed: boolean;
  showWarning: boolean;
} {
  if (state.messageCount >= CHAT_RATE_LIMIT) {
    return {
      newState: { ...state, limitReached: true },
      allowed: false,
      showWarning: false,
    };
  }

  const newCount = state.messageCount + 1;
  const showWarning = newCount >= CHAT_SOFT_WARNING && !state.warningShown;

  return {
    newState: {
      messageCount: newCount,
      warningShown: state.warningShown || showWarning,
      limitReached: newCount >= CHAT_RATE_LIMIT,
    },
    allowed: true,
    showWarning,
  };
}

/**
 * Reset rate limit state.
 * @returns Fresh rate limit state
 */
export function resetRateLimit(): RateLimitState {
  return createRateLimitState();
}
