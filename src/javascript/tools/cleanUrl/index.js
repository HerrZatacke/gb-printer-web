const cleanUrl = (dirtyUrl, protocol) => {
  if (!dirtyUrl.trim()) {
    return '';
  }

  if (dirtyUrl === '/' && protocol !== 'ws') {
    return dirtyUrl;
  }

  const hasProtocol = !!dirtyUrl.match(new RegExp(`^${protocol}(s)?:\\/\\/`, 'gi'));
  return `${hasProtocol ? '' : `${protocol}://`}${dirtyUrl}${dirtyUrl.endsWith('/') ? '' : '/'}`;
};

export default cleanUrl;
