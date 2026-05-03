import '@testing-library/jest-dom';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // Deprecated
    removeListener: () => {}, // Deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock HTMLMediaElement (for Audio tests)
window.HTMLMediaElement.prototype.play = async () => {};
window.HTMLMediaElement.prototype.pause = () => {};

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = () => {};
