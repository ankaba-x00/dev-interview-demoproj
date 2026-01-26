import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AuthForm from '@/components/common/AuthForm.vue';

/*
Tests:
1) Renders form title and submitLabel
2) Renders confirmPassword conditionally
3) Emits correct payload on submit without confirm (login)
4) Emits correct payload on submit with confirm (register)
5) Disables submit with passwords mismatch
6) Enables submit when passwords match
7) Clears form fields after submit
*/

const textFieldStub = {
  props: ['label', 'type', 'modelValue'],
  emits: ['update:modelValue'],
  template: `
    <label>
      {{ label }}
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </label>
  `,
};

const buttonStub = {
  props: ['disabled'],
  template: `
    <button :disabled="disabled">
      <slot />
    </button>
  `,
};

function mountForm(props = {}) {
  return mount(AuthForm, {
    props: {
      title: 'Auth Form Test',
      submitLabel: 'Submit',
      ...props,
    },
    global: {
      stubs: {
        'v-text-field': textFieldStub,
        'v-btn': buttonStub,
        'v-card': { template: '<div><slot /></div>' },
        'v-card-title': { template: '<div><slot /></div>' },
        'v-card-text': { template: '<div><slot /></div>' },
      },
    },
  });
};

describe('AuthForm', () => {
  it('renders form title and submitLabel', () => {
    const wrapper = mountForm({
      title: 'Login',
      submitLabel: 'Sign in',
    });

    expect(wrapper.text()).toContain('Login');
    expect(wrapper.text()).toContain('Sign in');
  });

  it('renders confirmPassword conditionally', () => {
    const cases = [
      { showConfirm: false, expected: false },
      { showConfirm: true, expected: true },
    ];

    cases.forEach(({ showConfirm, expected }) => {
      const wrapper = mountForm({ showConfirm });
      const hasConfirm = wrapper.text().includes('Confirm Password');

      expect(hasConfirm).toBe(expected);
    });
  });

  it('emits correct payload on submit without confirm', async () => {
    const wrapper = mountForm({ showConfirm: false });

    const inputs = wrapper.findAll('input');
    await inputs[0].setValue('test@test.de');
    await inputs[1].setValue('secretWord');

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')[0]).toEqual([
      {
        email: 'test@test.de',
        password: 'secretWord',
      },
    ]);
  });

  it('emits correct payload on submit with confirm', async () => {
    const wrapper = mountForm({ showConfirm: true });

    const inputs = wrapper.findAll('input');
    await inputs[0].setValue('test@test.de');
    await inputs[1].setValue('secretWord');
    await inputs[2].setValue('secretWord');

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')[0]).toEqual([
      {
        email: 'test@test.de',
        password: 'secretWord',
        confirmPassword: 'secretWord',
      },
    ]);
  });

  it('disables submit with passwords mismatch', async () => {
    const wrapper = mountForm({ showConfirm: true });

    const inputs = wrapper.findAll('input');
    await inputs[1].setValue('secretWord');
    await inputs[2].setValue('differentWord');

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('enables submit when passwords match', async () => {
    const wrapper = mountForm({ showConfirm: true });

    const inputs = wrapper.findAll('input');
    await inputs[1].setValue('secretWord');
    await inputs[2].setValue('secretWord');

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBeUndefined();
  });

  it('clears form fields after submit', async () => {
    const wrapper = mountForm({ showConfirm: true });

    const inputs = wrapper.findAll('input');
    await inputs[0].setValue('test@test.de');
    await inputs[1].setValue('secretWord');
    await inputs[2].setValue('secretWord');

    await wrapper.find('button').trigger('click');

    expect(inputs[0].element.value).toBe('');
    expect(inputs[1].element.value).toBe('');
    expect(inputs[2].element.value).toBe('');
  });
});
