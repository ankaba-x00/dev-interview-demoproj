import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from '@/components/layout/ThemeToggle.vue';

/*
Tests:
1) Renders dark-mode icon when theme is light
2) Renders light-mode icon when theme is dark
3) Toggles theme to dark and saves to localStorage on click
4) Toggles theme to light and saves to localStorage on click
5) Loads theme from localStorage on mount
6) Falls back to prefers-color-scheme when no localStorage value exists
*/

let darkValue = false;
const changeMock = vi.fn();
vi.mock('vuetify', () => ({
  useTheme: () => ({
    global: {
      current: {
        value: {
          get dark() {
            return darkValue;
          },
        },
      },
    },
    change: changeMock,
  }),
}));

function mountToggle() {
  return mount(ThemeToggle, {
    global: {
      stubs: {
        'v-btn': {
          template: `<button @click="$emit('click')"><slot /></button>`,
        },
        'v-icon': {
          template: `<span><slot /></span>`,
        },
      },
    },
  });
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    darkValue = false;
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders dark-mode icon when theme is light', () => {
    darkValue = false;

    const wrapper = mountToggle();

    expect(wrapper.text()).toContain('mdi-weather-night');
    expect(wrapper.attributes('aria-label')).toBe('Switch to dark mode');
  });

  it('renders light-mode icon when theme is dark', () => {
    darkValue = true;

    const wrapper = mountToggle();

    expect(wrapper.text()).toContain('mdi-weather-sunny');
    expect(wrapper.attributes('aria-label')).toBe('Switch to light mode');
  });

  it('toggles theme to dark and saves to localStorage on click', async () => {
    darkValue = false;

    const wrapper = mountToggle();
    await wrapper.find('button').trigger('click');

    expect(changeMock).toHaveBeenCalledWith('dark');
    expect(localStorage.getItem('themeMode')).toBe('dark');
  });

  it('toggles theme to light and saves to localStorage on click', async () => {
    darkValue = true;

    const wrapper = mountToggle();
    await wrapper.find('button').trigger('click');

    expect(changeMock).toHaveBeenCalledWith('light');
    expect(localStorage.getItem('themeMode')).toBe('light');
  });

  it('loads theme from localStorage on mount', () => {
    localStorage.setItem('themeMode', 'dark');

    mountToggle();

    expect(changeMock).toHaveBeenCalledWith('dark');
  });

  it('falls back to prefers-color-scheme when no localStorage value exists', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    mountToggle();

    expect(changeMock).toHaveBeenCalledWith('dark');
  });
});