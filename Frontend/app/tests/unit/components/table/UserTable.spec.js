import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserTable from '@/components/table/UserTable.vue';

/*
Tests:
1) Renders table with provided items
2) Renders row actions for each item
3) Does not render expanded rows when user is not admin
4) Renders expanded rows when user is admin
5) Emits update:sort-by when table emits sort event
6) Emits update:pagination when page changes
7) Emits update:pagination when items-per-page changes
*/

let isAdminMock = false;

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    get isAdmin() {
      return isAdminMock;
    },
  }),
}));

const CopyIconStub = {
  props: ['value'],
  template: `<span data-test="copy-icon">{{ value }}</span>`,
};

const RowActionsStub = {
  props: ['user'],
  template: `<div data-test="row-actions">{{ user.id }}</div>`,
};

const ExpandedRowStub = {
  props: ['user'],
  template: `<div data-test="expanded-row">{{ user.id }}</div>`,
};

const DataTableStub = {
  props: [
    'headers',
    'page',
    'items',
    'itemsLength',
    'itemsPerPage',
    'sortBy',
    'showExpand',
  ],
  emits: [
    'update:sort-by',
    'update:page',
    'update:items-per-page',
  ],
  template: `
    <div data-test="data-table">
      <slot
        name="item.name"
        v-for="item in items"
        :key="item.id"
        :value="item.name"
      />
      <slot
        name="item.email"
        v-for="item in items"
        :key="'email-' + item.id"
        :value="item.email"
      />
      <slot
        name="item.actions"
        v-for="item in items"
        :key="'actions-' + item.id"
        :internalItem="{ raw: item }"
      />
      <slot
        v-if="showExpand"
        name="expanded-row"
        v-for="item in items"
        :key="'expanded-' + item.id"
        :internalItem="{ raw: item }"
        :columns="headers"
      />
    </div>
  `,
};

function mountTable({ items, isAdmin = false } = {}) {
  isAdminMock = isAdmin;

  return mount(UserTable, {
    props: {
      items,
      sortBy: [],
      page: 1,
      itemsPerPage: 10,
      totalItems: items.length,
    },
    global: {
      stubs: {
        'v-data-table': DataTableStub,
        CopyIcon: CopyIconStub,
        UserTableRowActions: RowActionsStub,
        ExpandedRowContent: ExpandedRowStub,
      },
    },
  });
}

describe('UserTable', () => {
  const items = [
    {
      id: '1',
      name: 'First Test',
      email: 'first@test.de',
      location: 'Test',
      status: 'active',
      blocked: false,
    },
    {
      id: '2',
      name: 'Second Test',
      email: 'second@test.de',
      location: 'Test',
      status: 'inactive',
      blocked: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table with provided items', () => {
    const wrapper = mountTable({ items });

    expect(wrapper.find('[data-test="data-table"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-test="copy-icon"]')).toHaveLength(4);
    expect(wrapper.text()).toContain('First Test');
    expect(wrapper.text()).toContain('Second Test');
  });

  it('renders row actions for each item', () => {
    const wrapper = mountTable({ items });

    const actions = wrapper.findAll('[data-test="row-actions"]');
    expect(actions).toHaveLength(2);
    expect(actions[0].text()).toBe('1');
    expect(actions[1].text()).toBe('2');
  });

  it('does not render expanded rows when user is not admin', () => {
    const wrapper = mountTable({ items, isAdmin: false });

    expect(wrapper.findAll('[data-test="expanded-row"]')).toHaveLength(0);
  });

  it('renders expanded rows when user is admin', () => {
    const wrapper = mountTable({ items, isAdmin: true });

    expect(wrapper.findAll('[data-test="expanded-row"]')).toHaveLength(2);
  });

  it('emits update:sort-by when table emits sort event', async () => {
    const wrapper = mountTable({ items });

    await wrapper.findComponent(DataTableStub).vm.$emit('update:sort-by', [
      { key: 'name', order: 'asc' },
    ]);

    expect(wrapper.emitted('update:sort-by')).toBeTruthy();
    expect(wrapper.emitted('update:sort-by')[0][0]).toEqual([
      { key: 'name', order: 'asc' },
    ]);
  });

  it('emits update:pagination when page changes', async () => {
    const wrapper = mountTable({ items });

    await wrapper.findComponent(DataTableStub).vm.$emit('update:page', 2);

    expect(wrapper.emitted('update:pagination')).toBeTruthy();
    expect(wrapper.emitted('update:pagination')[0][0]).toEqual({
      page: 2,
      itemsPerPage: 10,
    });
  });

  it('emits update:pagination when items-per-page changes', async () => {
    const wrapper = mountTable({ items });

    await wrapper
      .findComponent(DataTableStub)
      .vm.$emit('update:items-per-page', 25);

    expect(wrapper.emitted('update:pagination')).toBeTruthy();
    expect(wrapper.emitted('update:pagination')[0][0]).toEqual({
      page: 1,
      itemsPerPage: 25,
    });
  });
});
