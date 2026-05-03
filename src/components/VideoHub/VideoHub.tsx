/**
 * @fileoverview Video Learning Hub component.
 * Displays election education videos from YouTube Data API.
 * Lazy loaded with React.lazy + Suspense.
 */

import React, { useEffect, useCallback } from 'react';
import { useYouTube } from '@/hooks/useYouTube';
import { useTranslation } from '@/contexts/TranslationContext';
import { SkeletonLoader } from '@/components/SkeletonLoader';

/**
 * Video Learning Hub displaying election education videos from YouTube.
 * @returns VideoHub JSX
 */
export function VideoHub(): JSX.Element {
  const { videos, isLoading, error, isDemoMode, selectedVideoId, fetchVideos, selectVideo } = useYouTube();
  const { t } = useTranslation();
  const hasFetched = React.useRef(false);

  /** Fetch videos on mount */
  useEffect(() => {
    if (!hasFetched.current) {
      const fetchIt = async () => {
        try {
          await fetchVideos();
        } catch { /* handled in hook */ }
      };
      fetchIt();
    }
  }, [fetchVideos]);

  /** Handle video card click */
  const handleVideoClick = useCallback((videoId: string) => {
    selectVideo(selectedVideoId === videoId ? null : videoId);
  }, [selectedVideoId, selectVideo]);

  /** Handle keyboard interaction on video cards */
  const handleVideoKeyDown = useCallback((e: React.KeyboardEvent, videoId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleVideoClick(videoId);
    }
  }, [handleVideoClick]);

  return (
    <section className="video-hub" aria-label={t('video.title')} id="video-section">
      <div className="video-hub__header">
        <h2 className="video-hub__title">{t('video.title')}</h2>
        <p className="video-hub__subtitle">{t('video.subtitle')}</p>
        {isDemoMode && <span className="video-hub__demo-badge" role="status">Demo Data</span>}
      </div>

      {error && <p className="video-hub__error" role="alert">{error}</p>}

      {isLoading && (
        <div className="video-hub__grid">
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonLoader key={`video-skel-${i}`} variant="video" ariaLabel="Loading video..." />
          ))}
        </div>
      )}

      {!isLoading && videos.length > 0 && (
        <div className="video-hub__grid">
          {videos.map((video) => (
            <div key={video.videoId + video.title} className="video-hub__card">
              {selectedVideoId === video.videoId ? (
                <div className="video-hub__player-container">
                  <iframe
                    className="video-hub__player"
                    src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ) : (
                <div
                  className="video-hub__thumbnail-container"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleVideoClick(video.videoId)}
                  onKeyDown={(e) => handleVideoKeyDown(e, video.videoId)}
                  aria-label={`Play video: ${video.title}`}
                >
                  <img
                    className="video-hub__thumbnail"
                    src={video.thumbnailUrl}
                    alt={`Thumbnail for ${video.title}`}
                    loading="lazy"
                  />
                  <div className="video-hub__play-overlay" aria-hidden="true">
                    <span className="video-hub__play-icon">▶</span>
                  </div>
                </div>
              )}

              <div className="video-hub__info">
                <h3 className="video-hub__video-title">{video.title}</h3>
                <p className="video-hub__channel">{video.channelTitle}</p>
                <p className="video-hub__views">
                  {video.viewCount} {t('video.views')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
