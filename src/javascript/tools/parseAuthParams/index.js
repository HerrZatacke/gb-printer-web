const parseAuthParams = () => {
  const searchParams = new URLSearchParams(window.location.hash.substr(1));

  // for now there's only dropbox oauth support, so it's assumed "access_token" refers to dropbox
  const dropboxAccessToken = searchParams.get('access_token');
  const dropboxAccessTokenExpiresAt = searchParams.get('expires_in');

  if (dropboxAccessToken) {
    window.location.replace('#/settings/dropbox');
    return {
      accessToken: dropboxAccessToken,
      accessTokenExpiresAt: (new Date()).getTime() + (dropboxAccessTokenExpiresAt * 1000),
    };
  }

  return {};
};

export default parseAuthParams;
