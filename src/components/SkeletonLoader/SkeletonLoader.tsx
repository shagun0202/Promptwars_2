/**
 * @fileoverview Skeleton loader component for async loading states.
 * Provides pulsing placeholder animations for content loading.
 */

/** Props for the SkeletonLoader component */
interface SkeletonLoaderProps {
  /** Number of skeleton lines to show */
  readonly lines?: number;
  /** Variant type: 'text', 'card', 'video' */
  readonly variant?: 'text' | 'card' | 'video';
  /** Accessible label */
  readonly ariaLabel?: string;
}

/**
 * Animated skeleton loader for loading states.
 * @param props - Component props
 * @returns Skeleton loader JSX
 */
export function SkeletonLoader({
  lines = 3,
  variant = 'text',
  ariaLabel = 'Loading content...',
}: SkeletonLoaderProps): JSX.Element {
  if (variant === 'card') {
    return (
      <div className="skeleton skeleton--card" role="status" aria-label={ariaLabel}>
        <div className="skeleton__image" />
        <div className="skeleton__body">
          <div className="skeleton__line skeleton__line--title" />
          <div className="skeleton__line skeleton__line--subtitle" />
          <div className="skeleton__line skeleton__line--short" />
        </div>
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }

  if (variant === 'video') {
    return (
      <div className="skeleton skeleton--video" role="status" aria-label={ariaLabel}>
        <div className="skeleton__thumbnail" />
        <div className="skeleton__body">
          <div className="skeleton__line skeleton__line--title" />
          <div className="skeleton__line skeleton__line--subtitle" />
        </div>
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }

  return (
    <div className="skeleton skeleton--text" role="status" aria-label={ariaLabel}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={`skeleton-line-${i}`}
          className={`skeleton__line ${i === lines - 1 ? 'skeleton__line--short' : ''}`}
        />
      ))}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}
