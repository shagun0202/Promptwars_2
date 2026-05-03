/**
 * @fileoverview Custom hook for Google Maps Geocoding and Embed APIs.
 * Converts addresses to coordinates and provides embed URLs.
 */

import { useState, useCallback } from 'react';
import type { GeocodingResult, PollingLocation } from '@/types';
import { API_ENDPOINTS, MAPS_DIRECTIONS_URL } from '@/constants';
import { sanitizeInput } from '@/utils/sanitize';
import { validateAddress } from '@/utils/validate';
import { cacheGet, cacheSet } from '@/utils/cache';
import { MOCK_GEOCODING_RESULT, MOCK_POLLING_LOCATION } from '@/utils/mockData';
import { logger } from '@/utils/logger';

/** Return type of useGoogleMaps hook */
export interface UseGoogleMapsReturn {
  readonly pollingLocation: PollingLocation | null;
  readonly embedUrl: string | null;
  readonly directionsUrl: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly isDemoMode: boolean;
  readonly searchAddress: (address: string) => Promise<void>;
}

/**
 * Hook for Google Maps geocoding and polling station lookup.
 * @returns Maps state and search method
 */
export function useGoogleMaps(): UseGoogleMapsReturn {
  const [pollingLocation, setPollingLocation] = useState<PollingLocation | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [directionsUrl, setDirectionsUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const apiKey = import.meta.env['VITE_MAPS_API_KEY'] as string | undefined;

  /** Fall back to mock data */
  const applyMockData = useCallback(() => {
    setIsDemoMode(true);
    setPollingLocation(MOCK_POLLING_LOCATION);
    const embed = `${API_ENDPOINTS.MAPS_EMBED}?q=${MOCK_GEOCODING_RESULT.lat},${MOCK_GEOCODING_RESULT.lng}`;
    const directions = `${MAPS_DIRECTIONS_URL}&destination=${MOCK_GEOCODING_RESULT.lat},${MOCK_GEOCODING_RESULT.lng}`;
    setEmbedUrl(embed);
    setDirectionsUrl(directions);
  }, []);

  /** Search for a polling station by address */
  const searchAddress = useCallback(async (address: string): Promise<void> => {
    const validation = validateAddress(address);
    if (!validation.isValid) {
      setError(validation.error ?? 'Invalid address');
      return;
    }

    const sanitized = sanitizeInput(address);
    setIsLoading(true);
    setError(null);

    try {
      const cacheKey = `maps-${sanitized}`;
      const cached = cacheGet<{ location: PollingLocation; embed: string; directions: string }>(cacheKey);
      if (cached) {
        setPollingLocation(cached.location);
        setEmbedUrl(cached.embed);
        setDirectionsUrl(cached.directions);
        return;
      }

      if (!apiKey) {
        applyMockData();
        return;
      }

      const geocodeUrl = `${API_ENDPOINTS.GEOCODING}?address=${encodeURIComponent(sanitized)}&key=${apiKey}`;
      const response = await fetch(geocodeUrl);
      const data = await response.json() as { status: string; results: Array<{ formatted_address: string; geometry: { location: { lat: number; lng: number } } }> };

      if (data.status !== 'OK' || !data.results[0]) {
        setError('Address not found. Please try a more specific address.');
        applyMockData();
        return;
      }

      const result = data.results[0];
      const geo: GeocodingResult = {
        formattedAddress: result.formatted_address,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      };

      const location: PollingLocation = {
        name: 'Designated Polling Station',
        address: geo.formattedAddress,
        hours: '7:00 AM - 6:00 PM',
        lat: geo.lat,
        lng: geo.lng,
        electionName: 'General Election — Lok Sabha',
      };

      const embed = `${API_ENDPOINTS.MAPS_EMBED}?key=${apiKey}&q=${geo.lat},${geo.lng}&zoom=15`;
      const directions = `${MAPS_DIRECTIONS_URL}&destination=${geo.lat},${geo.lng}`;

      setPollingLocation(location);
      setEmbedUrl(embed);
      setDirectionsUrl(directions);
      cacheSet(cacheKey, { location, embed, directions });
    } catch (err) {
      logger.error('Maps API error', err);
      applyMockData();
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, applyMockData]);

  return { pollingLocation, embedUrl, directionsUrl, isLoading, error, isDemoMode, searchAddress };
}
