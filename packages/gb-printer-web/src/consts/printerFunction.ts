export const PrinterFunction = {
  CHECKPRINTER: 'checkPrinter',
  FETCHIMAGES: 'fetchImages',
  CLEARPRINTER: 'clearPrinter',
} as const;
export type PrinterFunction = (typeof PrinterFunction)[keyof typeof PrinterFunction];
