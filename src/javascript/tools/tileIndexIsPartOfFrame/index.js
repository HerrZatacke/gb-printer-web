const tileIndexIsPartOfFrame = (tileIndex, handleExportFrame = 'keep') => {

  const checkIndex = tileIndex - (handleExportFrame === 'keep' ? 0 : 20);

  if (checkIndex < 40) {
    return true;
  }

  if (checkIndex >= 320) {
    return true;
  }

  switch (checkIndex % 20) {
    case 0:
    case 1:
    case 18:
    case 19:
      return true;
    default:
      return false;
  }
};

export default tileIndexIsPartOfFrame;
