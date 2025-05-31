import { translations, PluralTranslations } from './translations';

export interface FormatRelativeTimeOptions {
  /** Timestamp (ISO string, Unix ms, or Date object) */
  date: string | number | Date;
  /** Override "Just now" label */
  justNowLabel?: string;
  /** Disable tooltip */
  disableTooltip?: boolean;
  /** Force a specific timezone (default: local) */
  timezone?: string;
  /** Custom labels for different time ranges */
  labels?: {
    justNow?: string;
    future?: string;
    invalid?: string;
  };
  /** Language code (default: 'en') */
  locale?: string;
}

export interface FormattedTime {
  relativeTime: string;
  tooltipText?: string;
}

function formatMessage(template: string, n?: number): string {
  return template.replace('{n}', n?.toString() || '');
}

function getTranslation(locale: string): PluralTranslations {
  // Try full locale, then base language, then 'en'
  if (translations[locale]) return translations[locale];
  const base = locale.split('-')[0];
  if (translations[base]) return translations[base];
  return translations['en'];
}

/**
 * Formats a timestamp into a relative time string with optional tooltip
 */
export function formatRelativeTime(options: FormatRelativeTimeOptions): FormattedTime {
  const {
    date,
    justNowLabel,
    disableTooltip = false,
    timezone,
    labels = {},
    locale = 'en'
  } = options;

  const t: PluralTranslations = getTranslation(locale);

  // Parse input date
  let inputDate: Date;
  try {
    if (date === null || date === undefined || date === '') {
      return {
        relativeTime: labels.invalid || t.invalidDate
      };
    }
    inputDate = new Date(date);
    if (isNaN(inputDate.getTime())) {
      return {
        relativeTime: labels.invalid || t.invalidDate
      };
    }
  } catch {
    return {
      relativeTime: labels.invalid || t.invalidDate
    };
  }

  const now = new Date();
  const diffMs = now.getTime() - inputDate.getTime();
  const absDiffMs = Math.abs(diffMs);

  // Format relative time
  let relativeTime: string;
  if (absDiffMs < 1000) {
    relativeTime = labels.justNow || justNowLabel || t.justNow;
  } else if (absDiffMs < 60_000) {
    const seconds = Math.floor(absDiffMs / 1000);
    const key = diffMs < 0 ? 'inSeconds' : 'secondsAgo';
    const template = seconds === 1 ? t[key].one : t[key].other;
    relativeTime = formatMessage(template, seconds);
  } else if (absDiffMs < 3_600_000) {
    const minutes = Math.floor(absDiffMs / 60_000);
    const key = diffMs < 0 ? 'inMinutes' : 'minutesAgo';
    const template = minutes === 1 ? t[key].one : t[key].other;
    relativeTime = formatMessage(template, minutes);
  } else if (absDiffMs < 86_400_000) {
    const hours = Math.floor(absDiffMs / 3_600_000);
    const key = diffMs < 0 ? 'inHours' : 'hoursAgo';
    const template = hours === 1 ? t[key].one : t[key].other;
    relativeTime = formatMessage(template, hours);
  } else {
    const isCurrentYear = inputDate.getFullYear() === now.getFullYear();
    if (isCurrentYear) {
      relativeTime = inputDate.toLocaleDateString(locale, {
        month: "short",
        day: "numeric"
      });
    } else {
      relativeTime = inputDate.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
  }

  // Generate tooltip text if enabled
  let tooltipText: string | undefined;
  if (!disableTooltip) {
    try {
      const localTime = inputDate.toLocaleString(locale, {
        timeZone: timezone
      });
      const utcTime = inputDate.toUTCString();
      tooltipText = `Local: ${localTime}${timezone ? ` (${timezone})` : ''}\nUTC: ${utcTime}`;
    } catch (error) {
      // Fallback to local time if timezone is invalid
      const localTime = inputDate.toLocaleString(locale);
      const utcTime = inputDate.toUTCString();
      tooltipText = `Local: ${localTime}\nUTC: ${utcTime}`;
    }
  }

  return {
    relativeTime,
    tooltipText
  };
}