export const FeatureFlag = {
  GAPI_SHEETS: 'gapiSheets',
} as const;
export type FeatureFlag = (typeof FeatureFlag)[keyof typeof FeatureFlag];
