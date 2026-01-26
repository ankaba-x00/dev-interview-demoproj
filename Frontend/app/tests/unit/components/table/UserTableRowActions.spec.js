import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserTableRowActions from '@/components/table/UserTableRowActions.vue';

/*
Tests:
1) Renders three action buttons
2) Disables all buttons when user is not admin
3) Navigates to edit action on click
4) Navigates to delete action on click
5) Navigates to block action on click
*/

let isAdminMock = false;
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    get isAdmin() {
      return isAdminMock;
    },
  }),
}));

const pushMock = vi.fn();
const routeMock = {
  query: { page: '2', limit: '25' },
};

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useRoute: () => routeMock,
}));

function mountActions({ user, isAdmin = false }) {
  isAdminMock = isAdmin;

  return mount(UserTableRowActions, {
    props: { user },
    global: {
      stubs: {
        'v-tooltip': {
          template: `<div><slot name="activator" :props="{}" /></div>`,
        },
        'v-btn': {
          props: ['disabled'],
          template: `
            <button
              data-test="action-btn"
              :disabled="disabled"
              @click="$emit('click')"
            >
              <slot />
            </button>
          `,
        },
        'v-icon': {
          template: `<span class="icon"><slot /></span>`,
        },
      },
    },
  });
}

describe('UserTableRowActions', () => {
  const user = { id: 'abc123' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders three action buttons', () => {
    const wrapper = mountActions({ user, isAdmin: true });

    expect(wrapper.findAll('[data-test="action-btn"]')).toHaveLength(3);
  });

  it('disables all buttons when user is not admin', () => {
    const wrapper = mountActions({ user, isAdmin: false });

    const buttons = wrapper.findAll('[data-test="action-btn"]');
    buttons.forEach(btn => {
      expect(btn.attributes('disabled')).toBeDefined();
    });
  });

  it('navigates to edit action on click', async () => {
    const wrapper = mountActions({ user, isAdmin: true });

    const editBtn = wrapper.findAll('[data-test="action-btn"]')[0];
    await editBtn.trigger('click');

    expect(pushMock).toHaveBeenCalledWith({
      path: '/users',
      query: {
        page: '2',
        limit: '25',
        action: 'edit',
        id: 'abc123',
      },
    });
  });

  it('navigates to delete action on click', async () => {
    const wrapper = mountActions({ user, isAdmin: true });

    const deleteBtn = wrapper.findAll('[data-test="action-btn"]')[1];
    await deleteBtn.trigger('click');

    expect(pushMock).toHaveBeenCalledWith({
      path: '/users',
      query: {
        page: '2',
        limit: '25',
        action: 'delete',
        id: 'abc123',
      },
    });
  });

  it('navigates to block action on click', async () => {
    const wrapper = mountActions({ user, isAdmin: true });

    const blockBtn = wrapper.findAll('[data-test="action-btn"]')[2];
    await blockBtn.trigger('click');

    expect(pushMock).toHaveBeenCalledWith({
      path: '/users',
      query: {
        page: '2',
        limit: '25',
        action: 'block',
        id: 'abc123',
      },
    });
  });
});