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
      return false;
    }

    const itemsState = {
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

    localStorage.setItem('gbp-z-web-items', JSON.stringify(itemsState));

    const settingsState = {
      version: VERSION_LEGACY,
      state: {
        activePalette: legacyState.activePalette || 'bw',
        enableDebug: legacyState.enableDebug || false,
        exportFileTypes: legacyState.exportFileTypes || ['png'],
        exportScaleFactors: legacyState.exportScaleFactors || [4],
        forceMagicCheck: legacyState.forceMagicCheck || false,
        galleryView: legacyState.galleryView || '1x',
        handleExportFrame: legacyState.handleExportFrame || 'keep',
        hideDates: legacyState.hideDates || false,
        importDeleted: typeof legacyState.importDeleted === 'boolean' ? legacyState.importDeleted : true,
        importLastSeen: typeof legacyState.importLastSeen === 'boolean' ? legacyState.importLastSeen : true,
        importPad: legacyState.importPad || false,
        pageSize: typeof legacyState.pageSize === 'number' ? legacyState.pageSize : 60,
        preferredLocale: legacyState.preferredLocale || 'en-GB',
        printerParams: legacyState.printerParams || '',
        printerUrl: legacyState.printerUrl || '',
        savFrameTypes: legacyState.savFrameTypes || 'int',
        sortPalettes: legacyState.sortPalettes || 'default_desc',
        useSerials: legacyState.useSerials || false,
        videoParams: legacyState.videoParams || {},
      },
    };

    localStorage.setItem('gbp-z-web-settings', JSON.stringify(settingsState));

    const filtersState = {
      version: VERSION_LEGACY,
      state: {
        filtersActiveTags: [],
        imageSelection: legacyState.imageSelection || [],
        recentImports: legacyState.recentImports || [],
        sortBy: legacyState.sortBy || 'created_asc',
      },
    };

    localStorage.setItem('gbp-z-web-filters', JSON.stringify(filtersState));

    const storagesState = {
      version: VERSION_LEGACY,
      state: {
        dropboxStorage: legacyState.dropboxStorage || {},
        gitStorage: legacyState.gitStorage || {},
        syncLastUpdate: legacyState.syncLastUpdate || {},
      },
    };

    localStorage.setItem('gbp-z-web-storages', JSON.stringify(storagesState));

    // const debugState = JSON.parse(JSON.stringify(itemsState.state));
    // debugState.images = (debugState.images || []).length;
    // debugState.frames = (debugState.frames || []).length;
    // console.log({ debugState });
    return true;
  }

  return false;
};
