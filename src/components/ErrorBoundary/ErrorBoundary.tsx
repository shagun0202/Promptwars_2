/**
 * @fileoverview Error boundary component with retry functionality.
 * Wraps major sections to catch rendering errors gracefully.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger } from '@/utils/logger';

/** Props for the ErrorBoundary component */
interface ErrorBoundaryProps {
  /** Child components to render */
  readonly children: ReactNode;
  /** Fallback section name for display */
  readonly sectionName?: string;
}

/** State for the ErrorBoundary component */
interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean;
  /** The error message */
  errorMessage: string;
}

/**
 * Error boundary class component that catches rendering errors.
 * Shows a friendly "Try Again" fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error(`ErrorBoundary caught error in ${this.props.sectionName ?? 'unknown section'}`, error, errorInfo);
  }

  /** Reset the error state to retry rendering */
  private handleRetry = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert" aria-live="assertive">
          <div className="error-boundary__content">
            <span className="error-boundary__icon" aria-hidden="true">⚠️</span>
            <h3 className="error-boundary__title">Something went wrong</h3>
            <p className="error-boundary__message">
              {this.props.sectionName
                ? `The ${this.props.sectionName} section encountered an error.`
                : 'This section encountered an error. Please try again.'}
            </p>
            <button
              className="error-boundary__button"
              onClick={this.handleRetry}
              type="button"
              aria-label="Try again to load this section"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
