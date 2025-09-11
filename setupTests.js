import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock AudioContext
global.AudioContext = vi.fn().mockImplementation(() => ({
  createBuffer: vi.fn(),
  createBufferSource: vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    buffer: null,
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: { value: 1 },
  })),
  destination: {},
  resume: vi.fn().mockResolvedValue(),
  suspend: vi.fn().mockResolvedValue(),
  state: 'suspended',
  decodeAudioData: vi.fn().mockResolvedValue({}),
}));

global.webkitAudioContext = global.AudioContext;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock ResizeObserver for Radix UI components
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));