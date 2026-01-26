import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ref } from 'vue';
import AppLayout from '@/components/layout/AppLayout.vue';

/*
Tests: 
1) Renders TopBar by default
2) Renders SideBar when navMode is set to side in localStorage
3) Renders SideBar when navMode is set to top in localStorage
4) Toggles collapsed state when toggle-collapse is emitted
5) Switches layout from topbar mode when switch-layout is emitted
6) Switches layout from sidebar mode when switch-layout is emitted
7) Forces collapsed=false when switching layout
8) Auto-collapses when smAndDown is true
*/

const smAndDown = ref(false);

vi.mock('vuetify', () => ({
  useDisplay: () => ({
    smAndDown,
  }),
}));

const TopBarStub = {
  name: 'TopBar',
  props: ['collapsed'],
  emits: ['toggle-collapse', 'switch-layout'],
  template: `
    <div data-test="top-bar">
      <button data-test="toggle" @click="$emit('toggle-collapse')" />
      <button
        data-test="switch"
        @click="$emit('switch-layout', 'side')"
      />
    </div>
  `,
};

const SideBarStub = {
  name: 'SideBar',
  props: ['collapsed'],
  emits: ['toggle-collapse', 'switch-layout'],
  template: `
    <div data-test="side-bar">
      <button data-test="toggle" @click="$emit('toggle-collapse')" />
      <button
        data-test="switch"
        @click="$emit('switch-layout', 'top')"
      />
    </div>
  `,
};

const RouterViewStub = {
  template: '<div data-test="router-view" />',
};

function mountLayout() {
  return mount(AppLayout, {
    global: {
      stubs: {
        TopBar: TopBarStub,
        SideBar: SideBarStub,
        'v-main': { template: '<main><slot /></main>' },
        'router-view': RouterViewStub,
      },
    },
  });
}

describe('AppLayout', () => {
  beforeEach(() => {
    smAndDown.value = false;
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders TopBar by default', () => {
    const wrapper = mountLayout();

    expect(wrapper.find('[data-test="top-bar"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="side-bar"]').exists()).toBe(false);
  });

  it('renders SideBar when navMode is set to side in localStorage', async () => {
    localStorage.setItem('navMode', 'side');

    const wrapper = mountLayout();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="side-bar"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="top-bar"]').exists()).toBe(false);

    
  });

  it('renders SideBar when navMode is set to top in localStorage', async () => {
    localStorage.setItem('navMode', 'top');

    const wrapper = mountLayout();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="side-bar"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="top-bar"]').exists()).toBe(true);
  });

  it('switches layout from topbar mode when switch-layout is emitted', async () => {
    const wrapper = mountLayout();

    await wrapper
      .findComponent(TopBarStub)
      .find('[data-test="switch"]')
      .trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="side-bar"]').exists()).toBe(true);
    expect(localStorage.getItem('navMode')).toBe('side');
  });

  it('switches layout from sidebar mode when switch-layout is emitted', async () => {
    localStorage.setItem('navMode', 'side'); // because initial layout is top mode and empty localStorage
    
    const wrapper = mountLayout();
    await wrapper
      .findComponent(SideBarStub)
      .find('[data-test="switch"]')
      .trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="top-bar"]').exists()).toBe(true);
    expect(localStorage.getItem('navMode')).toBe('top');
  });

  it('toggles collapsed state when toggle-collapse is emitted', async () => {
    const wrapper = mountLayout();

    const topBar = wrapper.findComponent(TopBarStub);
    expect(topBar.props('collapsed')).toBe(false);

    await topBar.find('[data-test="toggle"]').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(TopBarStub).props('collapsed')).toBe(true);
  });

  it('forces collapsed=false when switching layout', async () => {
    const wrapper = mountLayout();

    wrapper.vm.collapsed = true;
    wrapper.findComponent(TopBarStub).vm.$emit('switch-layout', 'side');
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(SideBarStub).props('collapsed')).toBe(false);
  });

  it('auto-collapses when smAndDown is true', async () => {
    smAndDown.value = true;

    const wrapper = mountLayout();
    await wrapper.vm.$nextTick();

    const bar = wrapper.findComponent(TopBarStub);
    expect(bar.props('collapsed')).toBe(true);
  });
});