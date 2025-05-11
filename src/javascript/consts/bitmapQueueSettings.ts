export enum ImportContrastValue {
  WIDER = 'wider',
  WIDE = 'wide',
  NORMAL = 'normal',
  NARROW = 'narrow',
  NARROWER = 'narrower',
  EMULATOR = 'emulator',
}

interface ImportContrast {
  name: string,
  baseValues: number[],
  value: ImportContrastValue,
}

export const contrastSettings: ImportContrast[] = [
  {
    name: 'Wider',
    baseValues: [0x00, 0x44, 0xBB, 0xFF],
    value: ImportContrastValue.WIDER,
  },
  {
    name: 'Wide',
    baseValues: [0x00, 0x55, 0xAA, 0xFF],
    value: ImportContrastValue.WIDE,
  },
  {
    name: 'Normal',
    baseValues: [0x33, 0x66, 0x99, 0xCC],
    value: ImportContrastValue.NORMAL,
  },
  {
    name: 'Narrow',
    baseValues: [0x45, 0x73, 0xA2, 0xD0],
    value: ImportContrastValue.NARROW,
  },
  {
    name: 'Narrower',
    baseValues: [0x55, 0x71, 0x8D, 0xAA],
    value: ImportContrastValue.NARROWER,
  },
  {
    // Using src/assets/images/greys.png for reference
    name: 'From Emulator',
    baseValues: [0x40, 0x90, 0xE0, 0xFF],
    value: ImportContrastValue.EMULATOR,
  },
];
