import { config } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import ResizeObserver from 'resize-observer-polyfill';
import { vi } from 'vitest';

config.global.plugins = [createVuetify()];

config.global.stubs = {
  transition: false,
  'v-dialog': true,
};

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

global.ResizeObserver = ResizeObserver;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});