import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TranslationProvider } from '@/contexts/TranslationContext';
import App from '@/App';
import '@/index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <TranslationProvider>
        <App />
      </TranslationProvider>
    </StrictMode>
  );
}
