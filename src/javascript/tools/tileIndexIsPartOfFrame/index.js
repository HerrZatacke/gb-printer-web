const tileIndexIsPartOfFrame = (tileIndex) => {
  if (tileIndex < 40) {
    return true;
  }

  if (tileIndex >= 320) {
    return true;
  }

  switch (tileIndex % 20) {
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
