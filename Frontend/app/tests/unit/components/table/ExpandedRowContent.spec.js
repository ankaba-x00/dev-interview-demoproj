import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ExpandedRowContent from '@/components/table/ExpandedRowContent.vue';

/*
Tests:
1) Does not render anything when user is not admin
2) Renders expanded row when user is admin
3) Renders lastLogin and ipAddress values
4) Renders fallback dash when values are missing
*/

let isAdminMock = false;
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    get isAdmin() {
      return isAdminMock;
    },
  }),
}));

function mountRow(user) {
  return mount(ExpandedRowContent, {
    props: { user },
    global: {
      stubs: {
        'v-divider': {
          template: '<hr data-test="divider" />',
        },
      },
    },
  });
}

describe('ExpandedRowContent', () => {
  it('does not render anything when user is not admin', () => {
    isAdminMock = false;

    const wrapper = mountRow({
      lastLogin: '2026-01-01',
      ipAddress: '127.0.0.1',
    });

    expect(wrapper.find('.expanded-row').exists()).toBe(false);
  });

  it('renders expanded row when user is admin', () => {
    isAdminMock = true;

    const wrapper = mountRow({
      lastLogin: '2026-01-01',
      ipAddress: '127.0.0.1',
    });

    expect(wrapper.find('.expanded-row').exists()).toBe(true);
    expect(wrapper.find('[data-test="divider"]').exists()).toBe(true);
  });

  it('renders lastLogin and ipAddress values', () => {
    isAdminMock = true;

    const wrapper = mountRow({
      lastLogin: '2026-01-01',
      ipAddress: '127.0.0.1',
    });

    expect(wrapper.text()).toContain('Last login');
    expect(wrapper.text()).toContain('2026-01-01');
    expect(wrapper.text()).toContain('IP address');
    expect(wrapper.text()).toContain('127.0.0.1');
  });

  it('renders fallback dash when values are missing', () => {
    isAdminMock = true;

    const wrapper = mountRow({});

    const values = wrapper.findAll('.value');
    expect(values).toHaveLength(2);
    expect(values[0].text()).toBe('—');
    expect(values[1].text()).toBe('—');
  });
});
