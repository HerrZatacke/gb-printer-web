const getFrameHashesForExport = (what, { frames }, frameSetID = '') => {

  switch (what) {
    case 'frames':
      // export all frames
      return frames
        .map(({ hash }) => hash);
    case 'framegroup':
      // export selected only
      return frames
        .filter(({ id }) => id.startsWith(frameSetID))
        .map(({ hash }) => hash);
    default:
      return [];
  }
};

export default getFrameHashesForExport;
