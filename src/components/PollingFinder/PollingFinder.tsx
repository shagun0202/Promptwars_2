/**
 * @fileoverview Polling Station Finder component.
 * Uses Google Maps Geocoding + Embed to help users find their polling station.
 */

import { useState, useCallback } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useTranslation } from '@/contexts/TranslationContext';
import { SkeletonLoader } from '@/components/SkeletonLoader';

/**
 * Polling station finder with address input, map embed, and directions.
 * @returns Polling finder JSX
 */
export function PollingFinder(): JSX.Element {
  const { pollingLocation, embedUrl, directionsUrl, isLoading, error, isDemoMode, searchAddress } = useGoogleMaps();
  const { t } = useTranslation();
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  /** Handle form submission */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await searchAddress(address);
    } catch { /* handled in hook */ }
  }, [address, searchAddress]);

  /** Handle input change */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setFormError(null);
  }, []);

  return (
    <section className="polling" aria-label={t('polling.title')} id="polling-section">
      <div className="polling__header">
        <h2 className="polling__title">{t('polling.title')}</h2>
        <p className="polling__subtitle">{t('polling.subtitle')}</p>
      </div>

      <form className="polling__form" onSubmit={handleSubmit}>
        <div className="polling__input-group">
          <label htmlFor="address-input" className="sr-only">
            {t('polling.placeholder')}
          </label>
          <input
            id="address-input"
            type="text"
            className="polling__input"
            value={address}
            onChange={handleChange}
            placeholder={t('polling.placeholder')}
            minLength={10}
            aria-label="Enter your registered address to find polling station"
            autoComplete="street-address"
          />
          <button
            type="submit"
            className="polling__submit"
            disabled={isLoading || address.trim().length < 10}
            aria-label={t('polling.search')}
          >
            {isLoading ? '...' : t('polling.search')}
          </button>
        </div>
        {(error ?? formError) && (
          <p className="polling__error" role="alert">{error ?? formError}</p>
        )}
      </form>

      {isLoading && <SkeletonLoader variant="card" ariaLabel="Loading polling station..." />}

      {pollingLocation && !isLoading && (
        <div className="polling__result">
          {isDemoMode && (
            <span className="polling__demo-badge" role="status">Demo Data</span>
          )}

          <div className="polling__card">
            <h3 className="polling__station-name">{pollingLocation.electionName}</h3>
            <p className="polling__station-detail">
              <strong>{pollingLocation.name}</strong>
            </p>
            <p className="polling__station-detail">{pollingLocation.address}</p>
            <p className="polling__station-detail">
              <strong>{t('polling.hours')}:</strong> {pollingLocation.hours}
            </p>

            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="polling__directions-button"
                aria-label="Get directions to polling station on Google Maps"
              >
                📍 {t('polling.directions')}
              </a>
            )}
          </div>

          {embedUrl && (
            <div className="polling__map-container">
              <iframe
                className="polling__map"
                title="Polling station location map"
                src={embedUrl}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
