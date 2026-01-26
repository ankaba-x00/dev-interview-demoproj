import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import CopyIcon from '@/components/common/CopyIcon.vue';

/* 
Tests: 
1) Copies props.value after click (core)
2) Renders props.tooltipText before click
3) Renders props.copiedText after click
*/

describe('CopyIcon', () => {
  it('copies value on click', async () => {
    const wrapper = mount(CopyIcon, {
      props: { value: 'test' },
    });

    await wrapper.get('[data-test="copy-icon"]').trigger('click');

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test');
  });

  it('shows copy tooltip text before click', () => {
    const wrapper = mount(CopyIcon, {
      props: {
        value: 'hello',
        tooltipText: 'Copy',
      },
      global: {
        stubs: {
          'v-tooltip': {
            props: ['text'],
            template: '<div data-test="tooltip">{{ text }}</div>',
          },
        },
      },
    });

    expect(wrapper.get('[data-test="tooltip"]').text()).toBe('Copy');
  });

  it('shows copied tooltip text on click', async () => {
    vi.useFakeTimers();

    const wrapper = mount(CopyIcon, {
      props: {
        value: 'hello',
        tooltipText: 'Copy',
        copiedText: 'Copied!',
      },
      global: {
        stubs: {
          'v-tooltip': {
            props: ['text'],
            template: `
              <div>
                <slot name="activator" :props="{}"></slot>
                <div data-test="tooltip">{{ text }}</div>
              </div>
            `,
          },
        },
      },
    });

    await wrapper.get('[data-test="copy-icon"]').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.get('[data-test="tooltip"]').text()).toBe('Copied!');

    vi.useRealTimers();
  });
});