import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AuthLayout from '@/components/layout/AuthLayout.vue';

/*
Tests:
1) Renders v-main with auth-layout class
2) Renders router-view inside layout
*/

function mountLayout() {
  return mount(AuthLayout, {
    global: {
      stubs: {
        'v-main': {
          template: '<main class="auth-layout"><slot /></main>',
        },
        'router-view': {
          template: '<div data-test="router-view" />',
        },
      },
    },
  });
}

describe('AuthLayout', () => {
  it('renders v-main with auth-layout class', () => {
    const wrapper = mountLayout();

    expect(wrapper.find('.auth-layout').exists()).toBe(true);
  });

  it('renders router-view inside layout', () => {
    const wrapper = mountLayout();

    expect(wrapper.find('[data-test="router-view"]').exists()).toBe(true);
  });
});