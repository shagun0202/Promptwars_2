/**
 * @fileoverview Translation context provider.
 * Makes translation functions available to all components via React context.
 */

import { createContext, useContext, type ReactNode } from 'react';
import { useTranslate, type UseTranslateReturn } from '@/hooks/useTranslate';

/** Translation context type */
const TranslationContext = createContext<UseTranslateReturn | null>(null);

/** Props for TranslationProvider */
interface TranslationProviderProps {
  readonly children: ReactNode;
}

/**
 * Provider component that wraps the app to provide translation context.
 * @param props - Component props
 * @returns Provider component
 */
export function TranslationProvider({ children }: TranslationProviderProps): JSX.Element {
  const translationState = useTranslate();

  return (
    <TranslationContext.Provider value={translationState}>
      {children}
    </TranslationContext.Provider>
  );
}

/**
 * Hook to access translation context.
 * Must be used within a TranslationProvider.
 * @returns Translation state and methods
 * @throws Error if used outside TranslationProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation(): UseTranslateReturn {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
