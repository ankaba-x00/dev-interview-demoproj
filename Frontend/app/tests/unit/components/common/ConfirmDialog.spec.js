import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

/*
Tests: 
1) Renders dialog title and text
2) Emits update:modelValue=false when cancel is clicked + closes dialog window
3) Emits confirm when confirm is clicked + closes dialog window
*/

const dialogStub = {
  props: ['modelValue'],
  template: `
    <div v-if="modelValue">
      <slot />
    </div>
  `,
};

describe('ConfirmDialog', () => {
  const baseProps = {
    modelValue: true,
    title: 'Confirm Action Test',
    message: 'Are you sure?',
    confirmText: 'Confirm',
  };

  it('renders dialog title and message', () => {
    const wrapper = mount(ConfirmDialog, {
      props: baseProps,
      global: {
        stubs: {
          'v-dialog': dialogStub,
        },
      },
    });

    expect(wrapper.text()).toContain('Confirm Action Test');
    expect(wrapper.text()).toContain('Are you sure?');
  });

  it('emits update:modelValue=false when cancel is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: baseProps,
      global: {
        stubs: {
          'v-dialog': dialogStub,
        },
      },
    });

    const cancelBtn = wrapper.find('button');
    await cancelBtn.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false]);
  });

  it('emits confirm and closes dialog when confirm is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: baseProps,
      global: {
        stubs: {
          'v-dialog': dialogStub,
        },
      },
    });

    const buttons = wrapper.findAll('button');
    const confirmBtn = buttons[1];

    await confirmBtn.trigger('click');

    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false]);
  });
});
