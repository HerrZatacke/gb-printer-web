export const FeatureFlag = {
} as const;
export type FeatureFlag = (typeof FeatureFlag)[keyof typeof FeatureFlag];
