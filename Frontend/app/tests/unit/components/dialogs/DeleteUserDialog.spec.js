import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DeleteUserDialog from '@/components/dialogs/DeleteUserDialog.vue';

/*
Tests:
1) Renders delete dialog title, message and confirm text
2) Emits update:modelValue=false when Cancel is clicked
3) Emits event with user payload upon confirming
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
  return mount(DeleteUserDialog, {
    props,
    global: {
      stubs: {
        ConfirmDialog: confirmDialogStub,
      },
    },
  });
};

describe('DeleteUserDialog', () => {
  const baseUser = {
    name: 'Test Test',
  };

  it('renders delete dialog title, message and confirm text', () => {
    const wrapper = mountDialog({
      modelValue: true,
      user: baseUser,
    });

    expect(wrapper.get('[data-test="title"]').text()).toBe('Delete user');
    expect(wrapper.get('[data-test="message"]').text())
      .toBe('Are you sure you want to delete Test Test?');
    expect(wrapper.get('[data-test="confirm-text"]').text())
      .toBe('Delete');
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