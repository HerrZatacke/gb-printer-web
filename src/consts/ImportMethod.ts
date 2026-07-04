export const ImportMethod = {
  BITMAP: 'bitmap',
  PLAIN_TEXT: 'plainText',
  JSON: 'json',
  SAV: 'sav',
  PICO_REDUCED: 'picoReduced',
  WIFI_BIN: 'wifiBin',
} as const;
export type ImportMethod = (typeof ImportMethod)[keyof typeof ImportMethod];
