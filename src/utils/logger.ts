/**
 * @fileoverview Production-safe logger utility.
 * Wraps console methods and disables output in production builds.
 * Use this instead of console.log anywhere in the application.
 */

/** Whether the app is running in development mode */
const IS_DEV = import.meta.env.DEV;

/**
 * Log an informational message (development only).
 * @param message - The log message
 * @param args - Additional arguments to log
 */
function info(message: string, ...args: unknown[]): void {
  if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.info(`[SmartElect] ${message}`, ...args);
  }
}

/**
 * Log a warning message (development only).
 * @param message - The warning message
 * @param args - Additional arguments to log
 */
function warn(message: string, ...args: unknown[]): void {
  if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.warn(`[SmartElect] ${message}`, ...args);
  }
}

/**
 * Log an error message (development only).
 * @param message - The error message
 * @param args - Additional arguments to log
 */
function error(message: string, ...args: unknown[]): void {
  if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.error(`[SmartElect] ${message}`, ...args);
  }
}

/**
 * Log a debug message (development only).
 * @param message - The debug message
 * @param args - Additional arguments to log
 */
function debug(message: string, ...args: unknown[]): void {
  if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[SmartElect] ${message}`, ...args);
  }
}

/** Logger utility — wraps console, disabled in production */
export const logger = { info, warn, error, debug } as const;
