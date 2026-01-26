import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BlockUserDialog from '@/components/dialogs/BlockUserDialog.vue';

/*
Tests:
1) Renders block text and confirm text when user is not blocked
2) Renders unblock text and confirm text when user is blocked
3) Emits update:modelValue=false when Cancel is clicked
4) Emits event with user payload upon confirming
*/

const confirmDialogStub = {
  props: ['modelValue', 'title', 'message', 'confirmText'],
  emits: ['update:modelValue', 'confirm'],
  template: `
    <div>
      <div data-test="title">{{ title }}</div>
      <div data-test="message">{{ message }}</div>
      <div data-test="confirm-text">{{ confirmText }}</div>

      <button data-test="confirm" @click="$emit('confirm')" />
      <button data-test="close" @click="$emit('update:modelValue', false)" />
    </div>
  `,
};

function mountDialog(props) {
  return mount(BlockUserDialog, {
    props,
    global: {
      stubs: {
        ConfirmDialog: confirmDialogStub,
      },
    },
  });
};

describe('BlockUserDialog', () => {
  const baseUser = {
    name: 'Test Test',
    blocked: false,
  };

  it('renders block text and confirm text when user is not blocked', () => {
    const wrapper = mountDialog({
      modelValue: true,
      user: baseUser,
    });

    expect(wrapper.get('[data-test="title"]').text()).toBe('Block user');
    expect(wrapper.get('[data-test="message"]').text())
      .toBe('Are you sure you want to block Test Test?');
    expect(wrapper.get('[data-test="confirm-text"]').text())
      .toBe('Block');
  });

  it('renders unblock text and confirm text when user is blocked', () => {
    const wrapper = mountDialog({
      modelValue: true,
      user: { ...baseUser, blocked: true },
    });

    expect(wrapper.get('[data-test="message"]').text())
      .toBe('Are you sure you want to unblock Test Test?');
    expect(wrapper.get('[data-test="confirm-text"]').text())
      .toBe('Unblock');
  });

  it('emits update:modelValue=false when Cancel is clicked', async () => {
    const wrapper = mountDialog({
      modelValue: true,
      user: baseUser,
    });

    await wrapper.get('[data-test="close"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false]);
  });

  it('emits event with user payload upon confirming', async () => {
    const wrapper = mountDialog({
      modelValue: true,
      user: baseUser,
    });

    await wrapper.get('[data-test="confirm"]').trigger('click');

    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('confirm')[0]).toEqual([baseUser]);
  });
});