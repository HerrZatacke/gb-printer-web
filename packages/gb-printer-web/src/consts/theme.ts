export const ThemeName = {
  BRIGHT: 'theme-bright',
  DARK: 'theme-dark',
} as const;
export type ThemeName = (typeof ThemeName)[keyof typeof ThemeName];
