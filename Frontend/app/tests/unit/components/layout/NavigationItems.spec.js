import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NavigationItems from '@/components/layout/NavigationItems.vue';

/*
Tests:
1) Renders horizontal alignment with labels on desktop (topbar)
2) Renders horizontal alignment icon-only on mobile (topbar)
3) Renders vertical alignment with labels on desktop (sidebar)
4) Renders vertical alignment icon-only on mobile (sidebar)
*/

let smAndDownValue = false;

vi.mock('vuetify', () => ({
  useDisplay: () => ({
    get smAndDown() {
      return smAndDownValue;
    },
  }),
}));

function mountNav(props = {}, { smAndDown = false } = {}) {
  smAndDownValue = smAndDown;

  return mount(NavigationItems, {
    props: {
      orientation: 'horizontal',
      collapsed: false,
      ...props,
    },
    global: {
      stubs: {
        'v-btn': {
          template: `<button><slot /></button>`,
        },
        'v-icon': {
          template: `<span class="icon"><slot /></span>`,
        },
        'v-list': {
          template: `<div class="v-list"><slot /></div>`,
        },
        'v-list-item': {
          template: `<div class="v-list-item"><slot /></div>`,
        },
        'v-list-item-title': {
          template: `<span class="list-title"><slot /></span>`,
        },
      },
    },
  });
}

describe('NavigationItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    smAndDownValue = false;
  });

  it('renders horizontal alignment with labels on desktop', () => {
    const wrapper = mountNav(
      { orientation: 'horizontal' },
      { smAndDown: false },
    );

    expect(wrapper.text()).toContain('Home');
    expect(wrapper.text()).toContain('Users');
    expect(wrapper.findAll('.icon').length).toBe(2);
  });

  it('renders horizontal alignment icon-only on mobile', () => {
    const wrapper = mountNav(
      { orientation: 'horizontal' },
      { smAndDown: true },
    );

    expect(wrapper.text()).not.toContain('Home');
    expect(wrapper.text()).not.toContain('Users');
    expect(wrapper.findAll('.icon').length).toBe(2);
  });

  it('renders vertical alignment with labels on desktop', () => {
    const wrapper = mountNav(
      { orientation: 'vertical' },
      { smAndDown: false },
    );

    expect(wrapper.find('.v-list').exists()).toBe(true);
    expect(wrapper.text()).toContain('Home');
    expect(wrapper.text()).toContain('Users');
  });

  it('renders vertical alignment icon-only on mobile', () => {
    const wrapper = mountNav(
      { orientation: 'vertical' },
      { smAndDown: true },
    );

    expect(wrapper.find('.v-list').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('Home');
    expect(wrapper.text()).not.toContain('Users');
    expect(wrapper.findAll('.icon').length).toBe(2);
  });
});
