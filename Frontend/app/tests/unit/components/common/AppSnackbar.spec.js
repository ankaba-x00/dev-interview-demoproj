import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import AppSnackbar from '@/components/common/AppSnackbar.vue';
import { useNotificationStore } from '@/stores/notifications';

/*
Tests:
1) Renders message from notification store
2) Applies color class based on notification type
3) Hides snackbar when close button is clicked
4) Does not render snackbar when show is false
*/

const snackbarStub = {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <div v-if="modelValue" data-test="snackbar">
      <slot />
    </div>
  `,
};

const buttonStub = {
  emits: ['click'],
  template: `
    <button data-test="close-btn" @click="$emit('click')">
      close
    </button>
  `,
};

function mountSnackbar() {
  setActivePinia(createPinia());

  const store = useNotificationStore();

  const wrapper = mount(AppSnackbar, {
    global: {
      stubs: {
        'v-snackbar': snackbarStub,
        'v-btn': buttonStub,
      },
    },
  });

  return { wrapper, store };
}

describe('AppSnackbar', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders message from notification store', async () => {
    const { wrapper, store } = mountSnackbar();

    store.message = 'Operation successful';
    store.color = 'success';
    store.show = true;

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Operation successful');
  });

  it('applies color class based on notification type', async () => {
    const { wrapper, store } = mountSnackbar();

    store.message = 'Something went wrong';
    store.color = 'error';
    store.show = true;

    await wrapper.vm.$nextTick();

    const content = wrapper.find('.snackbar-content');
    expect(content.classes()).toContain('snackbar-error');
  });

  it('hides snackbar when close button is clicked', async () => {
    const { wrapper, store } = mountSnackbar();

    store.message = 'Closable message';
    store.color = 'info';
    store.show = true;

    await wrapper.vm.$nextTick();

    await wrapper.get('[data-test="close-btn"]').trigger('click');

    expect(store.show).toBe(false);
  });

  it('does not render snackbar when show is false', async () => {
    const { wrapper, store } = mountSnackbar();

    store.show = false;

    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="snackbar"]').exists()).toBe(false);
  });
});
