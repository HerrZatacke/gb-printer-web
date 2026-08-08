const parseAuthParams = (): { dropboxCode?: string } => {
  const searchParams = new URLSearchParams(window.location.search);

  // for now there's only dropbox oauth support, and dropbox redirects with the param 'code'
  const dropboxCode = searchParams.get('code');

  if (dropboxCode) {
    window.history.replaceState({}, '', window.location.pathname);
    return {
      dropboxCode,
    };
  }

  return {};
};

export default parseAuthParams;
