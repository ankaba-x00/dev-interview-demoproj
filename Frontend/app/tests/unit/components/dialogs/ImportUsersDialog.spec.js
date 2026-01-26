import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ImportUsersDialog from '@/components/dialogs/ImportUsersDialog.vue';
import Papa from 'papaparse';
import { defineComponent } from "vue";

/*
Tests:
1) Renders dialog title
2) Shows error for non-csv file
3) Parses CSV file and renders preview
4) Emits submit with file and closes dialog when Import is clicked
5) Emits update:modelValue=false and resets state when Cancel is clicked
*/

vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn(),
  },
}));

const dialogStub = {
  props: ['modelValue'],
  template: `<div v-if="modelValue"><slot /></div>`,
};

const fileInputStub = defineComponent({
  name: 'VFileInput',
  emits: ['update:modelValue'],
  template: `<div />`,
});

function mountDialog(props = {}) {
  return mount(ImportUsersDialog, {
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
        'v-file-input': fileInputStub,
        'v-alert': { template: '<div data-test="error"><slot /></div>' },
        'v-table': { template: '<table><slot /></table>' },
        'v-btn': {
          props: ['disabled'],
          template: `
            <button :disabled="disabled" @click="$emit('click')">
              <slot />
            </button>
          `,
        },
      },
    },
  });
};

describe('ImportUsersDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  });

  it('renders dialog title', () => {
    const wrapper = mountDialog();

    expect(wrapper.text()).toContain('Import users (CSV)');
  });

  it('shows error for non-csv file', async () => {
    const wrapper = mountDialog();

    const file = new File(['test'], 'users.txt', { type: 'text/plain' });

    await wrapper.findComponent({ name: 'VFileInput' })
      .vm.$emit('update:modelValue', file);

    expect(wrapper.text()).toContain('Only CSV files are allowed');
  });

  it('parses CSV file and renders preview', async () => {
    Papa.parse.mockImplementation((file, options) => {
      options.complete({
        data: [
          { name: 'First Test', email: 'ftest@test.de' },
          { name: 'Second Test', email: 'stest@test.de' },
        ],
        meta: { fields: ['name', 'email'] },
      });
    });

    const wrapper = mountDialog();

    const file = new File(['csv'], 'users.csv', { type: 'text/csv' });

    await wrapper.findComponent({ name: 'VFileInput' })
      .vm.$emit('update:modelValue', file);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Preview');
    expect(wrapper.text()).toContain('First Test');
    expect(wrapper.text()).toContain('stest@test.de');
  });

  it('emits submit with file and closes dialog when Import is clicked', async () => {
    Papa.parse.mockImplementation((file, options) => {
      options.complete({
        data: [{ name: 'Alice' }],
        meta: { fields: ['name'] },
      });
    });

    const wrapper = mountDialog();

    const file = new File(['csv'], 'users.csv', { type: 'text/csv' });

    await wrapper.findComponent({ name: 'VFileInput' })
      .vm.$emit('update:modelValue', file);

    const importBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Import');
    await importBtn.trigger('click');

    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')[0][0]).toBe(file);
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false]);
  });

  it('emits update:modelValue=false and resets state when Cancel is clicked', async () => {
    const wrapper = mountDialog();

    const cancelBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Cancel');
    await cancelBtn.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false]);
  });
});