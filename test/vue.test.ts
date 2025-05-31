import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RelativeTime } from '../src/vue';

describe('Vue RelativeTime Component', () => {
  const now = new Date('2025-06-01T14:30:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Basic rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(RelativeTime, {
        props: {
          date: now
        }
      });
      expect(wrapper.text()).toBe('Just now');
    });

    it('applies custom className', () => {
      const wrapper = mount(RelativeTime, {
        props: {
          date: now,
          className: 'custom-class'
        }
      });
      expect(wrapper.classes()).toContain('custom-class');
    });

    it('renders with tooltip by default', () => {
      const wrapper = mount(RelativeTime, {
        props: {
          date: now
        }
      });
      expect(wrapper.attributes('title')).toBeDefined();
      expect(wrapper.attributes('aria-label')).toBeDefined();
    });

    it('disables tooltip when specified', () => {
      const wrapper = mount(RelativeTime, {
        props: {
          date: now,
          disableTooltip: true
        }
      });
      expect(wrapper.attributes('title')).toBeUndefined();
      expect(wrapper.attributes('aria-label')).toBeUndefined();
    });
  });

  describe('Tooltip positioning', () => {
    it('sets default tooltip position to top', () => {
      const wrapper = mount(RelativeTime, {
        props: {
          date: now
        }
      });
      expect(wrapper.attributes('data-tooltip-position')).toBe('top');
    });

    it('allows custom tooltip position', () => {
      const wrapper = mount(RelativeTime, {
        props: {
          date: now,
          tooltipPosition: 'bottom'
        }
      });
      expect(wrapper.attributes('data-tooltip-position')).toBe('bottom');
    });
  });

  describe('Time formatting', () => {
    it('formats seconds ago', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const wrapper = mount(RelativeTime, {
        props: {
          date: fiveSecondsAgo
        }
      });
      expect(wrapper.text()).toBe('5s ago');
    });

    it('formats minutes ago', () => {
      const tenMinutesAgo = new Date(now.getTime() - 600000);
      const wrapper = mount(RelativeTime, {
        props: {
          date: tenMinutesAgo
        }
      });
      expect(wrapper.text()).toBe('10m ago');
    });

    it('formats hours ago', () => {
      const threeHoursAgo = new Date(now.getTime() - 10800000);
      const wrapper = mount(RelativeTime, {
        props: {
          date: threeHoursAgo
        }
      });
      expect(wrapper.text()).toBe('3h ago');
    });

    it('formats future times', () => {
      const fiveSecondsLater = new Date(now.getTime() + 5000);
      const wrapper = mount(RelativeTime, {
        props: {
          date: fiveSecondsLater
        }
      });
      expect(wrapper.text()).toBe('in 5s');
    });
  });

  describe('Internationalization', () => {
    it('renders in Spanish', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const wrapper = mount(RelativeTime, {
        props: {
          date: fiveSecondsAgo,
          locale: 'es'
        }
      });
      expect(wrapper.text()).toBe('hace 5s');
    });

    it('renders in Portuguese', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const wrapper = mount(RelativeTime, {
        props: {
          date: fiveSecondsAgo,
          locale: 'pt'
        }
      });
      expect(wrapper.text()).toBe('há 5s');
    });

    it('renders in German', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const wrapper = mount(RelativeTime, {
        props: {
          date: fiveSecondsAgo,
          locale: 'de'
        }
      });
      expect(wrapper.text()).toBe('vor 5s');
    });

    it('renders in French', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const wrapper = mount(RelativeTime, {
        props: {
          date: fiveSecondsAgo,
          locale: 'fr'
        }
      });
      expect(wrapper.text()).toBe('il y a 5s');
    });

    it('falls back to English for unknown locale', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const wrapper = mount(RelativeTime, {
        props: {
          date: fiveSecondsAgo,
          locale: 'unknown'
        }
      });
      expect(wrapper.text()).toBe('5s ago');
    });
  });

  describe('Live updates', () => {
    it('updates time when live prop is true', async () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const wrapper = mount(RelativeTime, {
        props: {
          date: fiveSecondsAgo,
          live: true
        }
      });
      
      expect(wrapper.text()).toBe('5s ago');
      
      // Advance time by 1 second
      vi.advanceTimersByTime(1000);
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toBe('6s ago');
    });

    it('respects custom update interval', async () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const wrapper = mount(RelativeTime, {
        props: {
          date: fiveSecondsAgo,
          live: true,
          liveInterval: 2000
        }
      });
      
      expect(wrapper.text()).toBe('5s ago');
      
      // Advance time by 1 second (should not update)
      vi.advanceTimersByTime(1000);
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toBe('5s ago');
      
      // Advance time by another second (should update)
      vi.advanceTimersByTime(1000);
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toBe('7s ago');
    });
  });

  describe('Edge cases', () => {
    it('handles invalid date', () => {
      const wrapper = mount(RelativeTime, {
        props: {
          date: 'invalid'
        }
      });
      expect(wrapper.text()).toBe('Invalid date');
    });

    it('handles empty string date', () => {
      const wrapper = mount(RelativeTime, {
        props: {
          date: ''
        }
      });
      expect(wrapper.text()).toBe('Invalid date');
    });

    it('handles very old dates', () => {
      const oldDate = new Date('1900-01-01');
      const wrapper = mount(RelativeTime, {
        props: {
          date: oldDate
        }
      });
      expect(wrapper.text()).toBe('Jan 1, 1900');
    });

    it('handles very future dates', () => {
      const futureDate = new Date('2100-01-01');
      const wrapper = mount(RelativeTime, {
        props: {
          date: futureDate
        }
      });
      expect(wrapper.text()).toBe('Jan 1, 2100');
    });
  });
}); 