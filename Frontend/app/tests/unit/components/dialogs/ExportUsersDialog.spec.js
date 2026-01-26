import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ExportUsersDialog from '@/components/dialogs/ExportUsersDialog.vue';

/*
Tests:
1) Renders dialog title and description
2) Emits filtered payload and closes dialog when Filtered list is clicked
3) Emits full payload and closes dialog when Full list is clicked
4) Emits update:modelValue=false when Cancel is clicked
*/

const dialogStub = {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <div v-if="modelValue">
      <slot />
    </div>
  `,
};

function mountDialog(props = {}) {
  return mount(ExportUsersDialog, {
    props: {
      modelValue: true,
      ...props,
    },
    global: {
      stubs: {
        'v-dialog': dialogStub,
        'v-card': { template: '<div><slot /></div>' },
        'v-card-title': { template: '<div><slot /></div>' },
        'v-card-text': { template: '<div><slot /></div>' },
        'v-card-actions': { template: '<div><slot /></div>' },
        'v-btn': {
          template: `<button @click="$emit('click')"><slot /></button>`,
        },
      },
    },
  });
};

describe('ExportUsersDialog', () => {
  it('renders dialog title and description', () => {
    const wrapper = mountDialog();

    expect(wrapper.text()).toContain('Export users');
    expect(wrapper.text()).toContain('Choose export format of user list');
  });

  it('emits filtered payload and closes dialog when Filtered list is clicked', async () => {
    const wrapper = mountDialog();

    const filteredBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Filtered list');

    await filteredBtn.trigger('click');

    expect(wrapper.emitted('export-filtered')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false]);
  });

  it('emits full payload and closes dialog when Full list is clicked', async () => {
    const wrapper = mountDialog();

    const fullBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Full list');

    await fullBtn.trigger('click');

    expect(wrapper.emitted('export-full')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false]);
  });

  it('emits update:modelValue=false when Cancel is clicked', async () => {
    const wrapper = mountDialog();

    const cancelBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Cancel');

    await cancelBtn.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false]);
  });
});
