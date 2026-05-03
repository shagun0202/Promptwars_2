# SmartElect

SmartElect is a production-grade, AI-powered interactive election education web application built with React 19, TypeScript, and Vite. It is designed to maximize Code Quality, Security, Efficiency, Testing, Accessibility, and Google Services integration.

## Features

- **Interactive Election Timeline:** 6-step timeline with unique backgrounds, TTS, and AI integration.
- **AI Chat Assistant:** Powered by Gemini, streams token-by-token, offers contextual suggestions, and implements strict rate-limiting.
- **Polling Station Finder:** Built with Google Maps (Geocoding + Embed) to locate local voting booths.
- **Video Learning Hub:** Lazy-loaded YouTube videos related to election education using the YouTube Data API v3.
- **Accessibility:** Full WCAG 2.1 AA compliance (high contrast, font scaling, dark mode, screen-reader support, fully localized TTS).
- **Security:** Sanitization on all inputs, strict rate limits, secure external links, no keys in source code.
- **Efficiency:** Session storage caching with TTL for API requests, debounced inputs.
- **Demo Mode:** If any API keys are omitted, the app smoothly falls back to mock responses.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create your `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Configure your Google Cloud API Keys (ensure you have billing enabled and the following APIs active):
   - **Gemini API:** via `aistudio.google.com` (key: `VITE_GEMINI_API_KEY`)
   - **Google Maps Geocoding & Embed APIs:** via Google Cloud Console (`VITE_MAPS_API_KEY`)
   - **YouTube Data API v3:** via Google Cloud Console (`VITE_YOUTUBE_API_KEY`)
   - **Google Cloud Text-to-Speech API:** via Google Cloud Console (`VITE_TTS_API_KEY`)
   - **Google Cloud Translation API:** via Google Cloud Console (`VITE_TRANSLATE_API_KEY`)

4. Run the development server:
   ```bash
   npm run dev
   ```

## Testing

Run tests with Vitest and React Testing Library:

```bash
# Run unit and integration tests
npm test

# Check code coverage (enforced > 80%)
npm run test:coverage
```

## Linting

```bash
# Lint the codebase (zero warnings enforced)
npm run lint
```

## Deployment

A `Dockerfile`, `nginx.conf`, and `cloudbuild.yaml` are included for zero-downtime deployment to Google Cloud Run in `asia-south1`. Keys should be passed as Cloud Build substitutions.
