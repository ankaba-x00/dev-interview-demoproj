import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  withinLoginRange,
  withinCustomRange,
} from '@/pages/users/helpers';

/*
Tests:
1) Returns true when no range is provided
2) Returns true when lastLogin is within 24h
3) Returns false when lastLogin is outside 24h
4) Handles 1 week range correctly
5) Returns false if lastLogin is missing
6) Returns true when lastLogin is inside custom range
7) Returns false when before custom range
8) Returns false when after custom range
9) Includes entire end day (inclusive)
*/

describe('Users page helpers', () => {
  let now;

  beforeEach(() => {
    now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // withinLoginRange
  it('returns true when no range is provided', () => {
    expect(withinLoginRange(new Date().toISOString(), null)).toBe(true);
  });

  it('returns true when lastLogin is within 24h', () => {
    const lastLogin = new Date(now - 60 * 60 * 1000).toISOString(); // 1h ago
    expect(withinLoginRange(lastLogin, '24h')).toBe(true);
  });

  it('returns false when lastLogin is outside 24h', () => {
    const lastLogin = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(withinLoginRange(lastLogin, '24h')).toBe(false);
  });

  it('handles 1 week range correctly', () => {
    const lastLogin = new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString();
    expect(withinLoginRange(lastLogin, '1w')).toBe(true);
  });

  // withinCustomRange
  it('returns false if lastLogin is missing', () => {
    expect(withinCustomRange(null, '2025-01-01', '2025-01-31')).toBe(false);
  });

  it('returns true when lastLogin is inside custom range', () => {
    const lastLogin = '2025-01-15T12:00:00Z';
    expect(
      withinCustomRange(lastLogin, '2025-01-01', '2025-01-31')
    ).toBe(true);
  });

  it('returns false when before custom range', () => {
    const lastLogin = '2023-12-31T23:59:59Z';
    expect(
      withinCustomRange(lastLogin, '2025-01-01', '2025-01-31')
    ).toBe(false);
  });

  it('returns false when after custom range', () => {
    const lastLogin = '2025-02-01T00:00:00Z';
    expect(
      withinCustomRange(lastLogin, '2025-01-01', '2025-01-31')
    ).toBe(false);
  });

  it('includes entire end day (inclusive)', () => {
    const lastLogin = '2025-01-31T23:59:59Z';
    expect(
      withinCustomRange(lastLogin, '2025-01-01', '2025-01-31')
    ).toBe(true);
  });
});
