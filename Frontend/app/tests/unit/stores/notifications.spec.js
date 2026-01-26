import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNotificationStore } from '@/stores/notifications';

/*
Tests:
1) Shows a success notification
2) Allows custom notify parameters
*/

describe('Notification Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('shows a success notification', () => {
    const store = useNotificationStore();

    store.success('Saved successfully');

    expect(store.show).toBe(true);
    expect(store.message).toBe('Saved successfully');
    expect(store.color).toBe('success');
    expect(store.timeout).toBe(4000);
  });

  it('allows custom notify parameters', () => {
    const store = useNotificationStore();

    store.notify('Hello', 'warning', 1000);

    expect(store.show).toBe(true);
    expect(store.message).toBe('Hello');
    expect(store.color).toBe('warning');
    expect(store.timeout).toBe(1000);
  });
});
