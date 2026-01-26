import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import FilterUsersDialog from '@/components/dialogs/FilterUsersDialog.vue';
import { useAuthStore } from '@/stores/auth';

/*
Tests:
1) Renders dialog title
2) Does not render admin-only filters for non-admin users
3) Renders admin-only filters for admin users
4) Emits apply payload and closes dialog when Filter is clicked
5) Emits correct payload for admin login range filter
6) Emits update:modelValue=false when Cancel is clicked
7) Resets form state when dialog is opened
*/

const dialogStub = {
  props: ['modelValue'],
  template: `<div v-if="modelValue"><slot /></div>`,
};

const checkboxStub = {
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

const selectStub = {
  props: ['modelValue', 'items', 'label'],
  emits: ['update:modelValue'],
  template: `
    <label>
      {{ label }}
      <select @change="$emit('update:modelValue', $event.target.value)">
        <option value="">---</option>
        <option
          v-for="item in items"
          :key="item.value"
          :value="item.value"
        >
          {{ item.title }}
        </option>
      </select>
    </label>
  `,
};

const textFieldStub = {
  props: ['modelValue', 'label'],
  emits: ['update:modelValue'],
  template: `
    <label>
      {{ label }}
      <input
        type="date"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </label>
  `,
};

function mountDialog({ isAdmin = false, modelValue = true } = {}) {
  setActivePinia(createPinia());
  const auth = useAuthStore();
  auth.user = isAdmin
    ? { role: 'ADMIN' }
    : { role: 'USER' };

  return mount(FilterUsersDialog, {
    props: { modelValue },
    global: {
      stubs: {
        'v-dialog': dialogStub,
        'v-card': { template: '<div><slot /></div>' },
        'v-card-title': { template: '<div><slot /></div>' },
        'v-card-text': { template: '<div><slot /></div>' },
        'v-card-actions': { template: '<div><slot /></div>' },
        'v-row': { template: '<div><slot /></div>' },
        'v-col': { template: '<div><slot /></div>' },
        'v-divider': { template: '<hr />' },
        'v-checkbox': checkboxStub,
        'v-select': selectStub,
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

describe('FilterUsersDialog', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });

  it('renders dialog title', () => {
    const wrapper = mountDialog();

    expect(wrapper.text()).toContain('Filter users');
  });

  it('does not render admin-only filters for non-admin users', () => {
    const wrapper = mountDialog({ isAdmin: false });

    expect(wrapper.text()).not.toContain('Last login');
    expect(wrapper.text()).not.toContain('Login from');
    expect(wrapper.text()).not.toContain('Login to');
  });

  it('renders admin-only filters for admin users', () => {
    const wrapper = mountDialog({ isAdmin: true });

    expect(wrapper.text()).toContain('Last login');
    expect(wrapper.text()).toContain('Login from');
    expect(wrapper.text()).toContain('Login to');
  });

  it('emits apply payload and closes dialog when Filter is clicked', async () => {
    const wrapper = mountDialog({ isAdmin: true });

    const checkboxes = wrapper.findAll('input[type="checkbox"]');

    // Active users
    await checkboxes[0].setChecked(true);

    const filterBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Filter');
    await filterBtn.trigger('click');

    expect(wrapper.emitted('apply')).toBeTruthy();
    expect(wrapper.emitted('apply')[0][0]).toEqual({
      isActive: true,
      isBlocked: undefined,
      loginRange: null,
      loginFrom: undefined,
      loginTo: undefined,
    });

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false]);
  });

  it('emits correct payload for admin login range filter', async () => {
    const wrapper = mountDialog({ isAdmin: true });

    const select = wrapper.find('select');
    await select.setValue('24h');

    const filterBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Filter');
    await filterBtn.trigger('click');

    expect(wrapper.emitted('apply')[0][0]).toEqual({
      isActive: undefined,
      isBlocked: undefined,
      loginRange: '24h',
      loginFrom: undefined,
      loginTo: undefined,
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

  it('resets form state when dialog is opened', async () => {
    const wrapper = mountDialog({ isAdmin: true, modelValue: false });

    await wrapper.setProps({ modelValue: true });

    const filterBtn = wrapper.findAll('button')
      .find(b => b.text() === 'Filter');
    
      expect(filterBtn.attributes('disabled')).toBeDefined();
  });
});