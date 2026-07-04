export const CompatibilityActionType = {
  CONFIRM_ASK: 'CONFIRM_ASK',
  CONFIRM_ANSWERED: 'CONFIRM_ANSWERED',
  ADD_IMAGES: 'ADD_IMAGES',
  IMPORT_FILES: 'IMPORT_FILES',
} as const;
export type CompatibilityActionType = (typeof CompatibilityActionType)[keyof typeof CompatibilityActionType];

export const ConfigParamType = {
  NUMBER: 'number',
  STRING: 'string',
  MULTILINE: 'multiline',
} as const;
export type ConfigParamType = (typeof ConfigParamType)[keyof typeof ConfigParamType];
