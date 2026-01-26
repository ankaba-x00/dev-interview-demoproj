import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import SearchUsersDialog from '@/components/dialogs/SearchUsersDialog.vue';

/*
Tests:
1) Renders dialog title
2) Disables Search button when no input is provided
3) Enables Search button when at least one valid field is filled
4) Emits apply payload with provided values and closes dialog
5) Does not emit apply when all fields are empty
6) Resets form fields when dialog is opened
7) Emits update:modelValue=false when Cancel is clicked
*/

const dialogStub = {
  props: ['modelValue'],
  template: `<div v-if="modelValue"><slot /></div>`,
};

const textFieldStub = {
  props: ['modelValue', 'label'],
  emits: ['update:modelValue'],
  template: `
    <label>
      {{ label }}
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </label>
  `,
};

function mountDialog(props = {}) {
  return mount(SearchUsersDialog, {
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
        'v-text-field': textFieldStub,
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

describe('SearchUsersDialog', () => {
  it('renders dialog title', () => {
    const wrapper = mountDialog();

    expect(wrapper.text()).toContain('Search users');
  });

  it('disables Search button when no input is provided', () => {
    const wrapper = mountDialog();

    const searchBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Search');

    expect(searchBtn.attributes('disabled')).toBeDefined();
  });

  it('enables Search button when at least one valid field is filled', async () => {
    const wrapper = mountDialog();

    const inputs = wrapper.findAll('input');
    await inputs[0].setValue('Test Test');

    const searchBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Search');

    expect(searchBtn.attributes('disabled')).toBeUndefined();
  });

  it('emits apply payload with provided values and closes dialog', async () => {
    const wrapper = mountDialog();

    const inputs = wrapper.findAll('input');

    await inputs[0].setValue('Test Test');
    await inputs[1].setValue('test@test.de');

    const searchBtn = wrapper.findAll('button').find(b => b.text() === 'Search');
    await searchBtn.trigger('click');

    expect(wrapper.emitted('apply')).toBeTruthy();
    expect(wrapper.emitted('apply')[0][0]).toEqual({
      name: 'Test Test',
      email: 'test@test.de',
      location: undefined,
    });

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false]);
  });

  it('does not emit apply when all fields are empty', async () => {
    const wrapper = mountDialog();

    const searchBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Search');
    await searchBtn.trigger('click');

    expect(wrapper.emitted('apply')).toBeFalsy();
  });

  it('resets form fields when dialog is opened', async () => {
    const wrapper = mountDialog({ modelValue: false });

    await wrapper.setProps({ modelValue: true });

    const inputs = wrapper.findAll('input');
    inputs.forEach(input => {
      expect(input.element.value).toBe('')
    });
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