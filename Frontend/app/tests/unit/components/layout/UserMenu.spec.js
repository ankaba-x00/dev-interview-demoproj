import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import UserMenu from '@/components/layout/UserMenu.vue';

/*
Tests:
1) Renders username passed down from parent
2) Renders default username when none provided
3) Emits logout event when Logout is clicked
*/

function mountMenu(props = {}) {
  return mount(UserMenu, {
    props,
    global: {
      stubs: {
        'v-menu': {
          template: `<div><slot name="activator" /><slot /></div>`,
        },
        'v-btn': {
          template: `<button><slot /></button>`,
        },
        'v-list': {
          template: `<div><slot /></div>`,
        },
        'v-list-item': {
          template: `<div v-bind="$attrs"><slot /></div>`,
        },
      },
    },
  });
}

describe('UserMenu', () => {
  it('renders username passed down from parent', () => {
    const wrapper = mountMenu({ username: 'test@test.de' });

    expect(wrapper.text()).toContain('test@test.de');
  });

  it('renders default username when none is provided', () => {
    const wrapper = mountMenu();

    expect(wrapper.text()).toContain('User');
  });

  it('emits logout event when Logout is clicked', async () => {
    const wrapper = mountMenu({ username: 'test@test.de' });

    const logoutItem = wrapper.find('[data-test="logout"]');
    await logoutItem.trigger('click');

    expect(wrapper.emitted('logout')).toBeTruthy();
  });
});
