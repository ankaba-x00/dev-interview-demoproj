import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import SideBar from '@/components/layout/SideBar.vue';
import { useAuthStore } from '@/stores/auth';

/*
Tests:
1) Renders full sidebar when not collapse
2) Renders collapsed toggle only when collapsed
3) Emits toggle-collapse when CollapseToggle is clicked
4) Emits switch-layout with "top" when switch button is clicked
5) Logs out and redirects to /login when UserMenu emits logout
*/

vi.mock('vuetify', () => ({
  useDisplay: () => ({
    smAndDown: false,
  }),
}));

const pushMock = vi.fn();
vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual, // createRouter, createWebHistory, etc.
    useRouter: () => ({
      push: pushMock,
    }),
  };
});

const CollapseToggleStub = {
  props: ['collapsed'],
  emits: ['toggle'],
  template: `
    <button data-test="collapse-toggle" @click="$emit('toggle')">
      toggle
    </button>
  `,
};

const NavigationItemsStub = {
  props: ['orientation', 'collapsed'],
  template: `<div data-test="nav-items" />`,
};

const ThemeToggleStub = {
  template: `<div data-test="theme-toggle" />`,
};

const UserMenuStub = {
  props: ['username'],
  emits: ['logout'],
  template: `
    <button data-test="logout" @click="$emit('logout')">
      logout
    </button>
  `,
};

const drawerStub = {
  template: `<div data-test="drawer"><slot /><slot name="append" /></div>`,
};

function mountSidebar({ collapsed = false } = {}) {
  setActivePinia(createPinia());

  const auth = useAuthStore();
  auth.user = { email: 'test@test.de' };
  auth.logout = vi.fn();

  return mount(SideBar, {
    props: { collapsed },
    global: {
      stubs: {
        'v-navigation-drawer': drawerStub,
        'v-list-item': { template: '<div><slot /></div>' },
        'v-divider': true,
        'v-btn': {
          template: `<button @click="$emit('click')"><slot /></button>`,
        },
        'v-icon': { template: '<span><slot /></span>' },

        CollapseToggle: CollapseToggleStub,
        NavigationItems: NavigationItemsStub,
        ThemeToggle: ThemeToggleStub,
        UserMenu: UserMenuStub,
      },
    },
  });
}

describe('SideBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders full sidebar when not collapsed', () => {
    const wrapper = mountSidebar({ collapsed: false });

    expect(wrapper.find('[data-test="drawer"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="nav-items"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="collapse-toggle"]').exists()).toBe(true);
  });

  it('renders collapsed toggle only when collapsed', () => {
    const wrapper = mountSidebar({ collapsed: true });

    expect(wrapper.find('[data-test="drawer"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="collapse-toggle"]').exists()).toBe(true);
  });

  it('emits toggle-collapse when CollapseToggle is clicked', async () => {
    const wrapper = mountSidebar({ collapsed: false });

    await wrapper.find('[data-test="collapse-toggle"]').trigger('click');

    expect(wrapper.emitted('toggle-collapse')).toBeTruthy();
  });

  it('emits switch-layout with "top" when switch button is clicked', async () => {
    const wrapper = mountSidebar({ collapsed: false });

    const buttons = wrapper.findAll('button');
    const switchBtn = buttons.find(b =>
      b.attributes('aria-label') === 'Switch to topbar layout'
    );

    await switchBtn.trigger('click');

    expect(wrapper.emitted('switch-layout')).toBeTruthy();
    expect(wrapper.emitted('switch-layout')[0]).toEqual(['top']);
  });

  it('logs out and redirects to /login when UserMenu emits logout', async () => {
    const wrapper = mountSidebar({ collapsed: false });
    const auth = useAuthStore();

    await wrapper.find('[data-test="logout"]').trigger('click');

    expect(auth.logout).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/login');
  });
});
