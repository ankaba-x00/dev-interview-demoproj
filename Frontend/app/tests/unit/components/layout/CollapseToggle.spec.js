import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CollapseToggle from '@/components/layout/CollapseToggle.vue';

/*
Tests:
1) Renders collapse icon and aria-label when expanded
2) Renders expand icon and aria-label when collapsed
3) Emits toggle when clicked
*/

function mountToggle(collapsed) {
  return mount(CollapseToggle, {
    props: { collapsed },
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

describe('CollapseToggle', () => {
  it('renders collapse icon and aria-label when expanded', () => {
    const wrapper = mountToggle(false);

    expect(wrapper.text()).toContain('mdi-arrow-collapse');
    expect(wrapper.find('button').attributes('aria-label'))
      .toBe('Collapse navigation');
  });

  it('renders expand icon and aria-label when collapsed', () => {
    const wrapper = mountToggle(true);

    expect(wrapper.text()).toContain('mdi-arrow-expand');
    expect(wrapper.find('button').attributes('aria-label'))
      .toBe('Expand navigation');
  });

  it('emits toggle when clicked', async () => {
    const wrapper = mountToggle(false);

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('toggle')).toBeTruthy();
  });
});