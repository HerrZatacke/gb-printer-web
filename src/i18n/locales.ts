import unique from '@/tools/unique';

export const defaultLocale = 'en-GB';

export const locales = [
  'de-DE',
  'en-CA',
  defaultLocale,
  'en-US',
];

export const shortLocales = unique((locales.map((locale: string) => (
  locale.split('-')[0]
))));
