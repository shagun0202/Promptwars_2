/**
 * @fileoverview Custom hook for YouTube Data API v3.
 * Searches for election education videos and fetches view counts.
 */

import { useState, useCallback } from 'react';
import type { VideoResult } from '@/types';
import { API_ENDPOINTS, YOUTUBE_SEARCH_QUERY, YOUTUBE_MAX_RESULTS } from '@/constants';
import { cacheGet, cacheSet } from '@/utils/cache';
import { MOCK_VIDEOS } from '@/utils/mockData';
import { logger } from '@/utils/logger';

/** Return type of useYouTube hook */
export interface UseYouTubeReturn {
  readonly videos: VideoResult[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly isDemoMode: boolean;
  readonly selectedVideoId: string | null;
  readonly fetchVideos: () => Promise<void>;
  readonly selectVideo: (videoId: string | null) => void;
}

/** YouTube search response shape */
interface YouTubeSearchItem {
  readonly id: { readonly videoId: string };
  readonly snippet: {
    readonly title: string;
    readonly channelTitle: string;
    readonly thumbnails: { readonly medium: { readonly url: string } };
  };
}

/** YouTube videos response shape */
interface YouTubeVideoStats {
  readonly id: string;
  readonly statistics: { readonly viewCount: string };
}

/**
 * Format a view count number to a human-readable string.
 * @param count - Raw view count
 * @returns Formatted string (e.g., "2.4M")
 */
function formatViewCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return count.toString();
}

/**
 * Hook for YouTube Data API with search and video details.
 * @returns YouTube state and methods
 */
export function useYouTube(): UseYouTubeReturn {
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const apiKey = import.meta.env['VITE_YOUTUBE_API_KEY'] as string | undefined;

  /** Fetch election education videos */
  const fetchVideos = useCallback(async (): Promise<void> => {
    const cacheKey = `youtube-${YOUTUBE_SEARCH_QUERY}`;
    const cached = cacheGet<VideoResult[]>(cacheKey);
    if (cached) {
      setVideos(cached);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!apiKey) {
        setVideos([...MOCK_VIDEOS]);
        setIsDemoMode(true);
        return;
      }

      const searchUrl = `${API_ENDPOINTS.YOUTUBE_SEARCH}?part=snippet&q=${encodeURIComponent(YOUTUBE_SEARCH_QUERY)}&type=video&maxResults=${YOUTUBE_MAX_RESULTS}&key=${apiKey}`;
      const searchResponse = await fetch(searchUrl);

      if (!searchResponse.ok) {
        throw new Error(`YouTube search error: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json() as { items: YouTubeSearchItem[] };
      const videoIds = searchData.items.map((item) => item.id.videoId).join(',');

      const statsUrl = `${API_ENDPOINTS.YOUTUBE_VIDEOS}?part=statistics&id=${videoIds}&key=${apiKey}`;
      const statsResponse = await fetch(statsUrl);

      if (!statsResponse.ok) {
        throw new Error(`YouTube stats error: ${statsResponse.status}`);
      }

      const statsData = await statsResponse.json() as { items: YouTubeVideoStats[] };
      const statsMap = new Map<string, number>();
      statsData.items.forEach((item) => {
        statsMap.set(item.id, parseInt(item.statistics.viewCount, 10));
      });

      const results: VideoResult[] = searchData.items.map((item) => {
        const rawCount = statsMap.get(item.id.videoId) ?? 0;
        return {
          videoId: item.id.videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnailUrl: item.snippet.thumbnails.medium.url,
          viewCount: formatViewCount(rawCount),
          viewCountRaw: rawCount,
        };
      });

      setVideos(results);
      cacheSet(cacheKey, results);
    } catch (err) {
      logger.error('YouTube API error', err);
      setIsDemoMode(true);
      setVideos([...MOCK_VIDEOS]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  /** Select a video for playback */
  const selectVideo = useCallback((videoId: string | null) => {
    setSelectedVideoId(videoId);
  }, []);

  return { videos, isLoading, error, isDemoMode, selectedVideoId, fetchVideos, selectVideo };
}
