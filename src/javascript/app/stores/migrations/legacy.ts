import type { ReduxState } from './history/0/State';

export const VERSION_LEGACY = 0;

export const migrateLegacy = (): boolean => {
  const legacyStateRaw = localStorage.getItem('gbp-web-state');
  // Must delete first before creating, because writing before deleting might cause
  // QuotaExceededError: Failed to execute 'setItem' on 'Storage': Setting the value of '...' exceeded the quota.
  // Also instantly delete this key to prevent accidental reload loops from initApp.tsx
  localStorage.removeItem('gbp-web-state');

  if (legacyStateRaw) {
    let legacyState: Partial<ReduxState>;
    try {
      legacyState = JSON.parse(legacyStateRaw) as Partial<ReduxState>;
    } catch {
      legacyState = {};
    }

    const combinedState = {
      version: VERSION_LEGACY,
      state: {
        frameGroupNames: legacyState.frameGroupNames || [],
        frames: legacyState.frames || [],
        images: legacyState.images || [],
        imageGroups: legacyState.imageGroups || [],
        palettes: legacyState.palettes || [],
        plugins: legacyState.plugins || [],
      },
    };

    // const debugState = JSON.parse(JSON.stringify(combinedState.state));
    // debugState.images = (debugState.images || []).length;
    // debugState.frames = (debugState.frames || []).length;
    // console.log({ debugState });

    localStorage.setItem('gbp-z-web-items', JSON.stringify(combinedState));
    return true;
  }

  return false;
};
