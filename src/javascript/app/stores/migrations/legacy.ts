export const VERSION_LEGACY = 0;

export const migrateLegacy = () => {
  const legacyStateRaw = localStorage.getItem('gbp-web-state');

  if (legacyStateRaw) {
    const legacyState = JSON.parse(legacyStateRaw);

    const combinedState = {
      version: VERSION_LEGACY,
      state: legacyState,
    };

    // Must delete first before creating, because writing before deleting might cause
    // QuotaExceededError: Failed to execute 'setItem' on 'Storage': Setting the value of '...' exceeded the quota.
    localStorage.removeItem('gbp-web-state');
    localStorage.setItem('gbp-z-web-items', JSON.stringify(combinedState));
    window.location.reload();
  }
};
