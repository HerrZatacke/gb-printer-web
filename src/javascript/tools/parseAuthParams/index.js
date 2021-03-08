const parseAuthParams = () => {
  const searchParams = new URLSearchParams(window.location.hash.substr(1));

  // for now there's only dropbox oauth support, so it's assumed "access_token" refers to dropbox
  const dropboxToken = searchParams.get('access_token');

  if (dropboxToken) {
    window.location.replace('#/settings');
    return { dropboxToken };
  }

  return {};
};

export default parseAuthParams;
