const cleanUrl = (dirtyUrl: string, protocol: string): string => {
  const trimmedDirtyUrl = dirtyUrl.trim();
  if (!trimmedDirtyUrl.trim()) {
    return '';
  }

  if (trimmedDirtyUrl === '/' && protocol !== 'ws') {
    return trimmedDirtyUrl;
  }

  const hasProtocol = !!trimmedDirtyUrl.match(new RegExp(`^${protocol}(s)?:\\/\\/`, 'gi'));
  return `${hasProtocol ? '' : `${protocol}://`}${trimmedDirtyUrl}${trimmedDirtyUrl.endsWith('/') ? '' : '/'}`;
};

export default cleanUrl;
