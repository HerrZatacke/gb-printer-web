export const VERSION_LEGACY = 0;

export const migrateLegacy = () => {
  const legacyStateRaw = localStorage.getItem('gbp-web-state');

  if (legacyStateRaw) {
    const legacyState = JSON.parse(legacyStateRaw);

    const combinedState = {
      version: VERSION_LEGACY,
      state: legacyState,
    };

    localStorage.setItem('gbp-z-web-items', JSON.stringify(combinedState));
    localStorage.removeItem('gbp-web-state');
    window.location.reload();
  }
};
