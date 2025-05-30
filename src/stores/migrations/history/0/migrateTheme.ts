import { ThemeName } from '../../../../../consts/theme';
import type { Settings } from '../../../settingsStore';
import settingsStore from '../../../settingsStore';

export const migrateTheme = (): ThemeName => {
  const legacyTheme = localStorage.getItem('gbp-web-theme') as ThemeName | null;

  if (legacyTheme) {
    settingsStore.getState().setThemeName(legacyTheme);
    localStorage.removeItem('gbp-web-theme');
    return legacyTheme;
  }

  try {
    const settings = JSON.parse(localStorage.getItem('gbp-z-web-settings') || 'null').state as Settings;
    const settingsTheme = settings.themeName;
    return settingsTheme || ThemeName.BRIGHT;
  } catch {
    return ThemeName.BRIGHT;
  }
};
