import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import UserTableToolbar from '@/components/table/UserTableToolbar.vue';

/*
Tests:
1) Renders all toolbar buttons
2) Emits create event when New User is clicked
3) Emits import event when Import is clicked
4) Emits search event when Search is clicked
5) Emits filter event when Filter is clicked
*/

function mountToolbar() {
  return mount(UserTableToolbar, {
    global: {
      stubs: {
        'v-row': {
          template: `<div><slot /></div>`,
        },
        'v-col': {
          template: `<div><slot /></div>`,
        },
        'v-btn': {
          template: `
            <button data-test="btn" @click="$emit('click')">
              <slot />
            </button>
          `,
        },
      },
    },
  });
}

describe('UserTableToolbar', () => {
  it('renders all toolbar buttons', () => {
    const wrapper = mountToolbar();

    const buttons = wrapper.findAll('[data-test="btn"]');
    expect(buttons).toHaveLength(4);

    expect(wrapper.text()).toContain('New User');
    expect(wrapper.text()).toContain('Import');
    expect(wrapper.text()).toContain('Search');
    expect(wrapper.text()).toContain('Filter');
  });

  it('emits create event when New User is clicked', async () => {
    const wrapper = mountToolbar();

    const btn = wrapper.findAll('[data-test="btn"]')[0];
    await btn.trigger('click');

    expect(wrapper.emitted('create')).toBeTruthy();
  });

  it('emits import event when Import is clicked', async () => {
    const wrapper = mountToolbar();

    const btn = wrapper.findAll('[data-test="btn"]')[1];
    await btn.trigger('click');

    expect(wrapper.emitted('import')).toBeTruthy();
  });

  it('emits search event when Search is clicked', async () => {
    const wrapper = mountToolbar();

    const btn = wrapper.findAll('[data-test="btn"]')[2];
    await btn.trigger('click');

    expect(wrapper.emitted('search')).toBeTruthy();
  });

  it('emits filter event when Filter is clicked', async () => {
    const wrapper = mountToolbar();

    const btn = wrapper.findAll('[data-test="btn"]')[3];
    await btn.trigger('click');

    expect(wrapper.emitted('filter')).toBeTruthy();
  });
});
