import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import UserForm from '@/components/common/UserForm.vue';

/*
Tests:
1) Renders all input fields
2) Blocks submit emit when required fields are missing
3) Emits sanitized payload on submit
4) Updates form state when modelValue changes
5) Toggles switches and changes payload
*/

const textFieldStub = {
  props: ['modelValue', 'label', 'placeholder'],
  emits: ['update:modelValue'],
  template: `
    <label>
      {{ label }}
      <input
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </label>
  `,
};

const switchStub = {
  props: ['modelValue', 'label'],
  emits: ['update:modelValue'],
  template: `
    <label>
      {{ label }}
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
    </label>
  `,
};

const formStub = {
  template: `<form><slot /></form>`,
};

function mountForm(modelValue = {}) {
  return mount(UserForm, {
    props: {
      modelValue: {
        name: '',
        email: '',
        location: '',
        status: 'inactive',
        blocked: false,
        ...modelValue,
      },
      placeholders: {
        name: 'Name',
        email: 'Email',
        location: 'Location',
      },
    },
    global: {
      stubs: {
        'v-text-field': textFieldStub,
        'v-switch': switchStub,
        'v-form': formStub,
      },
    },
  });
};

describe('UserForm', () => {
  it('renders all input fields', () => {
    const wrapper = mountForm();

    expect(wrapper.text()).toContain('Name');
    expect(wrapper.text()).toContain('Email');
    expect(wrapper.text()).toContain('Location');
    expect(wrapper.text()).toContain('Active');
    expect(wrapper.text()).toContain('Blocked');
  });

  it('blocks submit emit when required fields are missing', async () => {
    const wrapper = mountForm();

    wrapper.vm.submit();

    expect(wrapper.emitted('submit')).toBeFalsy();
  });

  it('emits sanitized payload on submit', async () => {
    const wrapper = mountForm({
      name: '  test   TEST-test ',
      email: '  TEST01@TeST.DE ',
      location: '  tEST-test ',
      status: 'active',
      blocked: true,
    });

    wrapper.vm.submit();

    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')[0][0]).toEqual({
      name: 'Test Test-Test',
      email: 'test01@test.de',
      location: 'Test-Test',
      status: 'active',
      blocked: true,
    });
  });

  it('updates form state when modelValue changes', async () => {
    const wrapper = mountForm({
      name: 'Old Test',
      email: 'oldtest@test.de',
    });

    await wrapper.setProps({
      modelValue: {
        name: 'New Test',
        email: 'newtest@test.de',
        location: 'Test',
        status: 'inactive',
        blocked: false,
      },
    });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].element.value).toBe('New Test');
    expect(inputs[1].element.value).toBe('newtest@test.de');
    expect(inputs[2].element.value).toBe('Test');
  });

  it('toggles switches and changes payload', async () => {
    const cases = [
      {
        name: 'status',
        initial: { status: 'inactive' },
        switchIndex: 0,
        expected: { status: 'active' },
      },
      {
        name: 'blocked',
        initial: { blocked: false },
        switchIndex: 1,
        expected: { blocked: true },
      },
    ];

    for (const { initial, switchIndex, expected } of cases) {
      const wrapper = mountForm({
        name: 'Test Test',
        email: 'test@test.de',
        ...initial,
      });

      const switches = wrapper.findAll('input[type="checkbox"]');
      await switches[switchIndex].setChecked(true);

      wrapper.vm.submit();

      expect(wrapper.emitted('submit')[0][0]).toMatchObject(expected);
    }
  });
});