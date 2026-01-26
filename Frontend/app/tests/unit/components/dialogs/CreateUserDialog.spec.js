import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CreateUserDialog from '@/components/dialogs/CreateUserDialog.vue';
import { defineComponent } from "vue";

/*
Tests:
1) Renders dialog title
2) Passes an empty user object to UserForm
3) Emits update:modelValue=false when Cancel is clicked
4) Emits submit and closes dialog when UserForm submits
5) Calls UserForm.submit() when Add is clicked
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
  return mount(CreateUserDialog, {
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

describe('CreateUserDialog', () => {
  it('renders dialog title', () => {
    const wrapper = mountDialog();

    expect(wrapper.text()).toContain('New user');
  });

  it('passes an empty user object to UserForm', () => {
    const wrapper = mountDialog();

    const userForm = wrapper.findComponent({ name: 'UserForm' });

    expect(userForm.props('modelValue')).toEqual({
      name: '',
      email: '',
      location: '',
      status: 'active',
      blocked: false,
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

  it('emits submit and closes dialog when UserForm submits', async () => {
    const wrapper = mountDialog();

    await wrapper.find('[data-test="form-submit"]').trigger('click');

    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')[0][0]).toEqual({
      name: '',
      email: '',
      location: '',
      status: 'active',
      blocked: false,
    });

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false]);
  });

  it('calls UserForm.submit() when Add is clicked', async () => {
    const wrapper = mountDialog();

    const addBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Add');

    await addBtn.trigger('click');

    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });
});