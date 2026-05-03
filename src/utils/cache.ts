/**
 * @fileoverview Session storage cache with typed get/set and TTL support.
 */

import { CACHE_TTL_MS } from '@/constants';
import type { CacheEntry } from '@/types';
import { logger } from '@/utils/logger';

/**
 * Store data in sessionStorage with TTL.
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttl - Time to live in ms (defaults to CACHE_TTL_MS)
 */
export function cacheSet<T>(key: string, data: T, ttl: number = CACHE_TTL_MS): void {
  try {
    const entry: CacheEntry<T> = { data, cachedAt: Date.now(), ttl };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch (err) {
    logger.warn('Cache set failed', err);
  }
}

/**
 * Retrieve data from sessionStorage, respecting TTL.
 * @param key - Cache key
 * @returns Cached data or null if expired/missing
 */
export function cacheGet<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() - entry.cachedAt > entry.ttl) {
      sessionStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch (err) {
    logger.warn('Cache get failed', err);
    return null;
  }
}

/**
 * Remove an item from cache.
 * @param key - Cache key to remove
 */
export function cacheRemove(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (err) {
    logger.warn('Cache remove failed', err);
  }
}
