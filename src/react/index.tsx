'use client';

import React from 'react';
import { formatRelativeTime, FormatRelativeTimeOptions } from '../core';

interface StrictDateType {
  date: string | number | Date;
}

export interface RelativeTimeProps extends Omit<FormatRelativeTimeOptions, 'disableTooltip'>, StrictDateType {
  /** CSS class name for the component */
  className?: string;
  /** Position of the tooltip */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  disableTooltip?: boolean;
  /** Language code (default: 'en') */
  locale?: string;
  /** Custom tooltip content */
  customTooltip?: string;
  /** Render prop for custom rendering */
  children?: (info: { relativeTime: string; tooltipText?: string; date: Date }) => React.ReactNode;
}

export const RelativeTime: React.FC<RelativeTimeProps> = ({
  date,
  className,
  tooltipPosition = 'top',
  timezone,
  labels,
  justNowLabel,
  disableTooltip,
  locale,
  customTooltip,
  children
}) => {
  const { relativeTime, tooltipText } = formatRelativeTime({
    date,
    timezone,
    labels,
    justNowLabel,
    disableTooltip,
    locale
  });

  // Parse date for <time> element
  const parsedDate = new Date(date);
  const dateTimeAttr = !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : undefined;

  // Tooltip logic
  const title = customTooltip ?? tooltipText;
  const ariaDescribedBy = title ? 'relative-time-tooltip' : undefined;

  if (children) {
    return <>{children({ relativeTime, tooltipText, date: parsedDate })}</>;
  }

  return (
    <time
      className={className}
      title={title}
      data-tooltip-position={tooltipPosition}
      aria-label={title}
      aria-describedby={ariaDescribedBy}
      dateTime={dateTimeAttr}
    >
      {relativeTime}
      {title && (
        <span id="relative-time-tooltip" style={{ display: 'none' }}>
          {title}
        </span>
      )}
    </time>
  );
}; 