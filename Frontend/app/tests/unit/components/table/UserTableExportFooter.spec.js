import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import UserTableExportFooter from '@/components/table/UserTableExportFooter.vue';

/*
Tests:
1) Renders export button
2) Emits export event when button is clicked
3) Accepts filteredUsers prop
*/

function mountFooter(props = {}) {
  return mount(UserTableExportFooter, {
    props: {
      filteredUsers: [],
      ...props,
    },
    global: {
      stubs: {
        'v-tooltip': {
          template: `<div><slot name="activator" :props="{}" /></div>`,
        },
        'v-btn': {
          template: `
            <button data-test="export-btn" @click="$emit('click')">
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

describe('UserTableExportFooter', () => {
  it('renders export button', () => {
    const wrapper = mountFooter();

    expect(wrapper.find('[data-test="export-btn"]').exists()).toBe(true);
    expect(wrapper.find('.icon').exists()).toBe(true);
  });

  it('emits export event when button is clicked', async () => {
    const wrapper = mountFooter();

    await wrapper.find('[data-test="export-btn"]').trigger('click');

    expect(wrapper.emitted('export')).toBeTruthy();
  });

  it('accepts filteredUsers prop', () => {
    const users = [{ id: 1 }, { id: 2 }];

    const wrapper = mountFooter({
      filteredUsers: users,
    });

    expect(wrapper.props('filteredUsers')).toHaveLength(2);
  });
});
