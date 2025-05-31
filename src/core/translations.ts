export interface PluralTranslations {
  justNow: string;
  secondsAgo: { one: string; other: string };
  minutesAgo: { one: string; other: string };
  hoursAgo: { one: string; other: string };
  inSeconds: { one: string; other: string };
  inMinutes: { one: string; other: string };
  inHours: { one: string; other: string };
  invalidDate: string;
}

export const translations: Record<string, PluralTranslations> = {
  en: {
    justNow: 'Just now',
    secondsAgo: { one: '1s ago', other: '{n}s ago' },
    minutesAgo: { one: '1m ago', other: '{n}m ago' },
    hoursAgo: { one: '1h ago', other: '{n}h ago' },
    inSeconds: { one: 'in 1s', other: 'in {n}s' },
    inMinutes: { one: 'in 1m', other: 'in {n}m' },
    inHours: { one: 'in 1h', other: 'in {n}h' },
    invalidDate: 'Invalid date'
  },
  es: {
    justNow: 'Ahora mismo',
    secondsAgo: { one: 'hace 1s', other: 'hace {n}s' },
    minutesAgo: { one: 'hace 1m', other: 'hace {n}m' },
    hoursAgo: { one: 'hace 1h', other: 'hace {n}h' },
    inSeconds: { one: 'en 1s', other: 'en {n}s' },
    inMinutes: { one: 'en 1m', other: 'en {n}m' },
    inHours: { one: 'en 1h', other: 'en {n}h' },
    invalidDate: 'Fecha inválida'
  },
  pt: {
    justNow: 'Agora mesmo',
    secondsAgo: { one: 'há 1s', other: 'há {n}s' },
    minutesAgo: { one: 'há 1m', other: 'há {n}m' },
    hoursAgo: { one: 'há 1h', other: 'há {n}h' },
    inSeconds: { one: 'em 1s', other: 'em {n}s' },
    inMinutes: { one: 'em 1m', other: 'em {n}m' },
    inHours: { one: 'em 1h', other: 'em {n}h' },
    invalidDate: 'Data inválida'
  },
  de: {
    justNow: 'Gerade eben',
    secondsAgo: { one: 'vor 1s', other: 'vor {n}s' },
    minutesAgo: { one: 'vor 1m', other: 'vor {n}m' },
    hoursAgo: { one: 'vor 1h', other: 'vor {n}h' },
    inSeconds: { one: 'in 1s', other: 'in {n}s' },
    inMinutes: { one: 'in 1m', other: 'in {n}m' },
    inHours: { one: 'in 1h', other: 'in {n}h' },
    invalidDate: 'Ungültiges Datum'
  },
  fr: {
    justNow: 'À l\'instant',
    secondsAgo: { one: 'il y a 1s', other: 'il y a {n}s' },
    minutesAgo: { one: 'il y a 1m', other: 'il y a {n}m' },
    hoursAgo: { one: 'il y a 1h', other: 'il y a {n}h' },
    inSeconds: { one: 'dans 1s', other: 'dans {n}s' },
    inMinutes: { one: 'dans 1m', other: 'dans {n}m' },
    inHours: { one: 'dans 1h', other: 'dans {n}h' },
    invalidDate: 'Date invalide'
  }
}; 