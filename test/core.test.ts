import { formatRelativeTime } from '../src/core';

describe('formatRelativeTime', () => {
  const now = new Date('2025-06-01T14:30:00Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(now);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic formatting', () => {
    it('formats "just now" for current time', () => {
      const result = formatRelativeTime({ date: now });
      expect(result.relativeTime).toBe('Just now');
    });

    it('formats seconds ago', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const result = formatRelativeTime({ date: fiveSecondsAgo });
      expect(result.relativeTime).toBe('5s ago');
    });

    it('formats minutes ago', () => {
      const tenMinutesAgo = new Date(now.getTime() - 600000);
      const result = formatRelativeTime({ date: tenMinutesAgo });
      expect(result.relativeTime).toBe('10m ago');
    });

    it('formats hours ago', () => {
      const threeHoursAgo = new Date(now.getTime() - 10800000);
      const result = formatRelativeTime({ date: threeHoursAgo });
      expect(result.relativeTime).toBe('3h ago');
    });

    it('formats current year dates', () => {
      const may30 = new Date('2025-05-30T12:00:00Z');
      const result = formatRelativeTime({ date: may30 });
      expect(result.relativeTime).toBe('May 30');
    });

    it('formats non-current year dates', () => {
      const dec12_2024 = new Date('2024-12-12T12:00:00Z');
      const result = formatRelativeTime({ date: dec12_2024 });
      expect(result.relativeTime).toBe('Dec 12, 2024');
    });
  });

  describe('Edge cases', () => {
    it('handles invalid dates', () => {
      const result = formatRelativeTime({ date: 'invalid' });
      expect(result.relativeTime).toBe('Invalid date');
    });

    it('handles null date', () => {
      const result = formatRelativeTime({ date: null as any });
      expect(result.relativeTime).toBe('Invalid date');
    });

    it('handles undefined date', () => {
      const result = formatRelativeTime({ date: undefined as any });
      expect(result.relativeTime).toBe('Invalid date');
    });

    it('handles empty string date', () => {
      const result = formatRelativeTime({ date: '' });
      expect(result.relativeTime).toBe('Invalid date');
    });

    it('handles future dates', () => {
      const fiveSecondsLater = new Date(now.getTime() + 5000);
      const result = formatRelativeTime({ date: fiveSecondsLater });
      expect(result.relativeTime).toBe('in 5s');
    });

    it('handles dates exactly at threshold boundaries', () => {
      const oneSecondAgo = new Date(now.getTime() - 1000);
      const oneMinuteAgo = new Date(now.getTime() - 60000);
      const oneHourAgo = new Date(now.getTime() - 3600000);
      const oneDayAgo = new Date(now.getTime() - 86400000);

      expect(formatRelativeTime({ date: oneSecondAgo }).relativeTime).toBe('1s ago');
      expect(formatRelativeTime({ date: oneMinuteAgo }).relativeTime).toBe('1m ago');
      expect(formatRelativeTime({ date: oneHourAgo }).relativeTime).toBe('1h ago');
      expect(formatRelativeTime({ date: oneDayAgo }).relativeTime).toBe('May 31');
    });
  });

  describe('DST transitions', () => {
    it('handles spring forward transition', () => {
      // March 10, 2024 - DST starts in US
      const beforeDST = new Date('2024-03-10T01:59:00-05:00');
      const afterDST = new Date('2024-03-10T03:01:00-04:00');
      
      const result1 = formatRelativeTime({ date: beforeDST });
      const result2 = formatRelativeTime({ date: afterDST });
      
      expect(result1.relativeTime).toBe('Mar 10, 2024');
      expect(result2.relativeTime).toBe('Mar 10, 2024');
    });

    it('handles fall back transition', () => {
      // November 3, 2024 - DST ends in US
      const beforeDST = new Date('2024-11-03T01:59:00-04:00');
      const afterDST = new Date('2024-11-03T01:01:00-05:00');
      
      const result1 = formatRelativeTime({ date: beforeDST });
      const result2 = formatRelativeTime({ date: afterDST });
      
      expect(result1.relativeTime).toBe('Nov 3, 2024');
      expect(result2.relativeTime).toBe('Nov 3, 2024');
    });
  });

  describe('Leap year handling', () => {
    it('handles February 29 in leap year', () => {
      const leapDay = new Date('2024-02-29T12:00:00Z');
      const result = formatRelativeTime({ date: leapDay });
      expect(result.relativeTime).toBe('Feb 29, 2024');
    });

    it('handles February 28 in non-leap year', () => {
      const nonLeapDay = new Date('2023-02-28T12:00:00Z');
      const result = formatRelativeTime({ date: nonLeapDay });
      expect(result.relativeTime).toBe('Feb 28, 2023');
    });
  });

  describe('Timezone handling', () => {
    it('respects specified timezone', () => {
      const date = new Date('2025-01-01T00:00:00Z');
      const result = formatRelativeTime({ 
        date,
        timezone: 'America/New_York'
      });
      expect(result.tooltipText).toContain('America/New_York');
    });

    it('handles invalid timezone gracefully', () => {
      const date = new Date('2025-01-01T00:00:00Z');
      const result = formatRelativeTime({ 
        date,
        timezone: 'Invalid/Timezone'
      });
      expect(result.tooltipText).toBeDefined();
    });
  });

  describe('Customization', () => {
    it('includes tooltip text by default', () => {
      const result = formatRelativeTime({ date: now });
      expect(result.tooltipText).toContain('Local:');
      expect(result.tooltipText).toContain('UTC:');
    });

    it('disables tooltip when specified', () => {
      const result = formatRelativeTime({ date: now, disableTooltip: true });
      expect(result.tooltipText).toBeUndefined();
    });

    it('uses custom labels', () => {
      const result = formatRelativeTime({
        date: now,
        labels: {
          justNow: 'A moment ago',
          invalid: 'Invalid timestamp'
        }
      });
      expect(result.relativeTime).toBe('A moment ago');
    });

    it('prioritizes labels object over legacy justNowLabel', () => {
      const result = formatRelativeTime({
        date: now,
        justNowLabel: 'Legacy label',
        labels: {
          justNow: 'New label'
        }
      });
      expect(result.relativeTime).toBe('New label');
    });
  });

  describe('Translations', () => {
    it('uses English by default', () => {
      const result = formatRelativeTime({ date: now });
      expect(result.relativeTime).toBe('Just now');
    });

    it('supports Spanish translations', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const result = formatRelativeTime({ 
        date: fiveSecondsAgo,
        locale: 'es'
      });
      expect(result.relativeTime).toBe('hace 5s');
    });

    it('supports Portuguese translations', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const result = formatRelativeTime({ 
        date: fiveSecondsAgo,
        locale: 'pt'
      });
      expect(result.relativeTime).toBe('há 5s');
    });

    it('supports German translations', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const result = formatRelativeTime({ 
        date: fiveSecondsAgo,
        locale: 'de'
      });
      expect(result.relativeTime).toBe('vor 5s');
    });

    it('supports French translations', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const result = formatRelativeTime({ 
        date: fiveSecondsAgo,
        locale: 'fr'
      });
      expect(result.relativeTime).toBe('il y a 5s');
    });

    it('falls back to English for unknown locale', () => {
      const result = formatRelativeTime({ 
        date: now,
        locale: 'unknown'
      });
      expect(result.relativeTime).toBe('Just now');
    });
  });
}); 