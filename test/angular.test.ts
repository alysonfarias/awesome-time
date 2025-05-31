import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RelativeTimeComponent } from '../src/angular/relative-time.component';

describe('Angular RelativeTime Component', () => {
  let component: RelativeTimeComponent;
  let fixture: ComponentFixture<RelativeTimeComponent>;
  const now = new Date('2025-06-01T14:30:00Z');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelativeTimeComponent]
    }).compileComponents();

    jasmine.clock().install();
    jasmine.clock().mockDate(now);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelativeTimeComponent);
    component = fixture.componentInstance;
  });

  describe('Basic rendering', () => {
    it('renders with default props', () => {
      component.date = now;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('Just now');
    });

    it('applies custom className', () => {
      component.date = now;
      component.className = 'custom-class';
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('time').classList).toContain('custom-class');
    });

    it('renders with tooltip by default', () => {
      component.date = now;
      fixture.detectChanges();
      const timeElement = fixture.nativeElement.querySelector('time');
      expect(timeElement.getAttribute('title')).toBeDefined();
      expect(timeElement.getAttribute('aria-label')).toBeDefined();
    });

    it('disables tooltip when specified', () => {
      component.date = now;
      component.disableTooltip = true;
      fixture.detectChanges();
      const timeElement = fixture.nativeElement.querySelector('time');
      expect(timeElement.getAttribute('title')).toBeNull();
      expect(timeElement.getAttribute('aria-label')).toBeNull();
    });
  });

  describe('Tooltip positioning', () => {
    it('sets default tooltip position to top', () => {
      component.date = now;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('time').getAttribute('data-tooltip-position')).toBe('top');
    });

    it('allows custom tooltip position', () => {
      component.date = now;
      component.tooltipPosition = 'bottom';
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('time').getAttribute('data-tooltip-position')).toBe('bottom');
    });
  });

  describe('Time formatting', () => {
    it('formats seconds ago', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      component.date = fiveSecondsAgo;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('5s ago');
    });

    it('formats minutes ago', () => {
      const tenMinutesAgo = new Date(now.getTime() - 600000);
      component.date = tenMinutesAgo;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('10m ago');
    });

    it('formats hours ago', () => {
      const threeHoursAgo = new Date(now.getTime() - 10800000);
      component.date = threeHoursAgo;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('3h ago');
    });

    it('formats future times', () => {
      const fiveSecondsLater = new Date(now.getTime() + 5000);
      component.date = fiveSecondsLater;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('in 5s');
    });
  });

  describe('Internationalization', () => {
    it('renders in Spanish', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      component.date = fiveSecondsAgo;
      component.locale = 'es';
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('hace 5s');
    });

    it('renders in Portuguese', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      component.date = fiveSecondsAgo;
      component.locale = 'pt';
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('há 5s');
    });

    it('renders in German', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      component.date = fiveSecondsAgo;
      component.locale = 'de';
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('vor 5s');
    });

    it('renders in French', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      component.date = fiveSecondsAgo;
      component.locale = 'fr';
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('il y a 5s');
    });

    it('falls back to English for unknown locale', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      component.date = fiveSecondsAgo;
      component.locale = 'unknown';
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('5s ago');
    });
  });

  describe('Live updates', () => {
    it('updates time when live prop is true', fakeAsync(() => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      component.date = fiveSecondsAgo;
      component.live = true;
      fixture.detectChanges();
      
      expect(fixture.nativeElement.textContent.trim()).toBe('5s ago');
      
      // Advance time by 1 second
      tick(1000);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('6s ago');
    }));

    it('respects custom update interval', fakeAsync(() => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      component.date = fiveSecondsAgo;
      component.live = true;
      component.liveInterval = 2000;
      fixture.detectChanges();
      
      expect(fixture.nativeElement.textContent.trim()).toBe('5s ago');
      
      // Advance time by 1 second (should not update)
      tick(1000);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('5s ago');
      
      // Advance time by another second (should update)
      tick(1000);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('7s ago');
    }));
  });

  describe('Edge cases', () => {
    it('handles invalid date', () => {
      component.date = 'invalid' as any;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('Invalid date');
    });

    it('handles empty string date', () => {
      component.date = '';
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('Invalid date');
    });

    it('handles very old dates', () => {
      const oldDate = new Date('1900-01-01');
      component.date = oldDate;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('Jan 1, 1900');
    });

    it('handles very future dates', () => {
      const futureDate = new Date('2100-01-01');
      component.date = futureDate;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('Jan 1, 2100');
    });
  });
}); 