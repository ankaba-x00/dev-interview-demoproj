import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import EditUserDialog from '@/components/dialogs/EditUserDialog.vue';
import { defineComponent } from "vue";

/*
Tests:
1) Renders dialog title
2) Passes a user object to UserForm as placeholders
2) Emits update:modelValue=false when Cancel is clicked
3) Emits submit payload with user id and closes dialog when UserForm submits
4) Calls UserForm.submit() when Update is clicked
*/

const dialogStub = {
  props: ['modelValue'],
  template: `
    <div v-if="modelValue">
      <slot />
    </div>
  `,
};

const userFormStub = defineComponent({
  name: 'UserForm',
  props: ['modelValue', 'placeholders'],
  emits: ['submit'],
  setup(props, { emit, expose }) {
    function submit() {
      emit('submit', props.modelValue)
    }
    expose({ submit })
    return { submit }
  },
  template: `
    <button data-test="form-submit" @click="submit">
      submit
    </button>
  `,
});

function mountDialog(props = {}) {
  return mount(EditUserDialog, {
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
        UserForm: userFormStub,
      },
    },
  });
};

describe('EditUserDialog', () => {
  const user = {
    id: '123',
    name: 'Test Test',
    email: 'test@test.com',
    location: 'Test',
    status: 'active',
    blocked: false,
  };

  it('renders dialog title', () => {
    const wrapper = mountDialog({ user });

    expect(wrapper.text()).toContain('Edit user');
  });

  it('passes a user object to UserForm as placeholders', () => {
    const wrapper = mountDialog({ user });

    const userForm = wrapper.findComponent({ name: 'UserForm' });

    expect(userForm.props('placeholders')).toEqual({
      name: 'Test Test',
      email: 'test@test.com',
      location: 'Test',
    });
  });

  it('emits update:modelValue=false when Cancel is clicked', async () => {
    const wrapper = mountDialog({ user });

    const cancelBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Cancel');
    await cancelBtn.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false]);
  });

  it('emits submit payload with user id and closes dialog when UserForm submits', async () => {
    const wrapper = mountDialog({ user });

    await wrapper.get('[data-test="form-submit"]').trigger('click');

    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')[0][0]).toEqual({
      id: '123',
      name: 'Test Test',
      email: 'test@test.com',
      location: 'Test',
      status: 'active',
      blocked: false,
    });
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false]);
  });

  it('calls UserForm.submit() when Update is clicked', async () => {
    const wrapper = mountDialog({ user });

    const updateBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Update');

    await updateBtn.trigger('click');

    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });
});