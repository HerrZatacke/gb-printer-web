export enum ImportContrastValue {
  WIDER = 'wider',
  WIDE = 'wide',
  NORMAL = 'normal',
  NARROW = 'narrow',
  NARROWER = 'narrower',
  EMULATOR = 'emulator',
}

interface ImportContrast {
  translationKey: string,
  baseValues: number[],
  value: ImportContrastValue,
}

export const contrastSettings: ImportContrast[] = [
  {
    translationKey: 'contrastSettings.wider',
    baseValues: [0x00, 0x44, 0xBB, 0xFF],
    value: ImportContrastValue.WIDER,
  },
  {
    translationKey: 'contrastSettings.wide',
    baseValues: [0x00, 0x55, 0xAA, 0xFF],
    value: ImportContrastValue.WIDE,
  },
  {
    translationKey: 'contrastSettings.normal',
    baseValues: [0x33, 0x66, 0x99, 0xCC],
    value: ImportContrastValue.NORMAL,
  },
  {
    translationKey: 'contrastSettings.narrow',
    baseValues: [0x45, 0x73, 0xA2, 0xD0],
    value: ImportContrastValue.NARROW,
  },
  {
    translationKey: 'contrastSettings.narrower',
    baseValues: [0x55, 0x71, 0x8D, 0xAA],
    value: ImportContrastValue.NARROWER,
  },
  {
    // Using src/assets/images/greys.png for reference
    translationKey: 'contrastSettings.emulator',
    baseValues: [0x40, 0x90, 0xE0, 0xFF],
    value: ImportContrastValue.EMULATOR,
  },
];
