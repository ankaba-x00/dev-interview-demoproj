import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia } from 'pinia';
import UsersPage from '@/pages/users/index.vue';
import api from '@/api/axios';
import { useNotificationStore } from '@/stores/notifications';

/*
Tests:
1) Fetches users on mount
2) Shows loader while loading
3) Renders table after loading
4) Opens create dialog when toolbar emits create
5) Creates user and refetches list
6) Exports full list and shows notification
7) Updates route when pagination changes
*/

vi.mock('@/api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const pushMock = vi.fn();

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useRouter: () => ({ push: pushMock }),
    useRoute: () => ({ query: {} }),
  };
});

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    isAdmin: true,
  }),
}));

const ToolbarStub = {
  emits: ['create', 'import', 'search', 'filter'],
  template: `<div data-test="toolbar" />`,
};

const UserTableStub = {
  emits: ['update:sort-by', 'update:pagination'],
  template: `<div data-test="table" />`,
};

const ExportFooterStub = {
  emits: ['export'],
  template: `<div data-test="export-footer" />`,
};

const DialogStub = {
  emits: ['submit', 'confirm', 'apply', 'update:modelValue'],
  template: `<div />`,
};

const CreateUserDialogStub = {
  emits: ['submit'],
  template: `<div data-test="create-dialog" />`,
};

const ExportUsersDialogStub = {
  emits: ['export-full', 'export-filtered'],
  template: `<div data-test="export-dialog" />`,
};

const LoaderStub = {
  template: `<div data-test="loader" />`,
};

function mountPage() {
  const pinia = createPinia();

  api.get.mockResolvedValueOnce({
    data: {
      data: [
        {
          _id: '1',
          name: 'Test User',
          email: 'test@test.de',
          location: 'Test',
          isActive: true,
          isBlocked: false,
        },
      ],
    },
  });

  return mount(UsersPage, {
    global: {
      plugins: [pinia],
      stubs: {
        UserTableToolbar: ToolbarStub,
        UserTable: UserTableStub,
        UserTableExportFooter: ExportFooterStub,
        CreateUserDialog: CreateUserDialogStub,
        ImportUsersDialog: DialogStub,
        SearchUsersDialog: DialogStub,
        FilterUsersDialog: DialogStub,
        EditUserDialog: DialogStub,
        DeleteUserDialog: DialogStub,
        BlockUserDialog: DialogStub,
        ExportUsersDialog: ExportUsersDialogStub,
        PulseLoader: LoaderStub,
        'v-divider': true,
      },
    },
  });
}

describe('Users page (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches users on mount', () => {
    mountPage();

    expect(api.get).toHaveBeenCalledWith(
      '/users',
      expect.objectContaining({
        params: expect.any(Object),
      })
    );
  });

  it('shows loader while loading', async () => {
    api.get.mockReturnValueOnce(new Promise(() => {}));

    const wrapper = mountPage();

    expect(wrapper.find('[data-test="loader"]').exists()).toBe(true);
  });

  it('renders table after loading', async () => {
    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.find('[data-test="table"]').exists()).toBe(true);
  });

  it('opens create dialog when toolbar emits create', async () => {
    const wrapper = mountPage();
    await flushPromises();

    await wrapper.findComponent(ToolbarStub).vm.$emit('create');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="create-dialog"]').exists()).toBe(true);
  });

  it('creates user and refetches list', async () => {
    api.post.mockResolvedValueOnce({});
    api.get.mockResolvedValueOnce({ data: { data: [] } });

    const wrapper = mountPage();
    await flushPromises();

    await wrapper.findComponent(CreateUserDialogStub).vm.$emit('submit', {
      name: 'New User',
      email: 'new@test.de',
      location: 'X',
      status: 'active',
      blocked: false,
    });

    await flushPromises();

    expect(api.post).toHaveBeenCalledWith(
      '/users',
      expect.objectContaining({
        name: 'New User',
        email: 'new@test.de',
      })
    );

    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('exports full list and shows notification', async () => {
    const wrapper = mountPage();
    const notify = useNotificationStore();

    const successSpy = vi.spyOn(notify, 'success');

    api.get
      .mockResolvedValueOnce({ data: { data: [] } }) // refresh
      .mockResolvedValueOnce({ data: 'csv-data' });  // export

    await flushPromises();

    await wrapper.findComponent(ExportFooterStub).vm.$emit('export');
    await flushPromises();

    await wrapper.findComponent(ExportUsersDialogStub).vm.$emit('export-full');
    await flushPromises();

    expect(successSpy).toHaveBeenCalledWith(
      'Full export successful'
    );
  });

  it('updates route when pagination changes', async () => {
    const wrapper = mountPage();
    await flushPromises();

    await wrapper.findComponent(UserTableStub).vm.$emit('update:pagination', {
      page: 2,
      itemsPerPage: 50,
    });

    expect(pushMock).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          page: 2,
          limit: 50,
        }),
      })
    );
  });
});