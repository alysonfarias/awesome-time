import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { formatRelativeTime, FormatRelativeTimeOptions } from '../core';

@Component({
  selector: 'relative-time',
  template: `
    <time
      [class]="className"
      [title]="title"
      [attr.data-tooltip-position]="tooltipPosition"
      [attr.aria-label]="title"
      [attr.aria-describedby]="ariaDescribedBy"
      [attr.datetime]="dateTime"
    >
      {{ relativeTime }}
      <span *ngIf="title" id="relative-time-tooltip" style="display: none">
        {{ title }}
      </span>
    </time>
  `,
  standalone: true
})
export class RelativeTimeComponent implements OnInit, OnChanges, OnDestroy {
  @Input() date!: string | number | Date;
  @Input() className?: string;
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() disableTooltip?: boolean;
  @Input() locale: string = 'en';
  @Input() customTooltip?: string;
  @Input() timezone?: string;
  @Input() labels?: Record<string, string>;
  @Input() justNowLabel?: string;
  @Input() live?: boolean;
  @Input() liveInterval: number = 1000;

  relativeTime: string = '';
  tooltipText: string = '';
  private updateInterval: any;

  get title(): string | undefined {
    return this.customTooltip ?? this.tooltipText;
  }

  get ariaDescribedBy(): string | undefined {
    return this.title ? 'relative-time-tooltip' : undefined;
  }

  get dateTime(): string {
    return new Date(this.date).toISOString();
  }

  ngOnInit(): void {
    this.updateTime();
    if (this.live) {
      this.startLiveUpdates();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date'] || changes['locale'] || changes['timezone'] || 
        changes['labels'] || changes['justNowLabel'] || changes['disableTooltip']) {
      this.updateTime();
    }

    if (changes['live']) {
      if (this.live) {
        this.startLiveUpdates();
      } else {
        this.stopLiveUpdates();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopLiveUpdates();
  }

  private updateTime(): void {
    const result = formatRelativeTime({
      date: this.date,
      timezone: this.timezone,
      labels: this.labels,
      justNowLabel: this.justNowLabel,
      disableTooltip: this.disableTooltip,
      locale: this.locale
    });
    this.relativeTime = result.relativeTime;
    this.tooltipText = result.tooltipText ?? '';
  }

  private startLiveUpdates(): void {
    if (this.live && !this.updateInterval) {
      this.updateInterval = setInterval(() => this.updateTime(), this.liveInterval);
    }
  }

  private stopLiveUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
} 