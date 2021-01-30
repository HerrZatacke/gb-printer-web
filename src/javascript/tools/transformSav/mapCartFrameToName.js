const mapCartFrameToName = (frameNumber, savFrameTypes, frames) => {

  const frameIsDefined = (frameId) => frames.find(({ id }) => id === frameId);

  const paddedFrameNumber = (frameNumber + 1).toString(10).padStart(2, '0');

  const exactFrameId = `${savFrameTypes}${paddedFrameNumber}`;
  if (frameIsDefined(exactFrameId)) {
    return exactFrameId;
  }

  // for js frame, try to fall back to int frames, as jp/int share a lot
  if (savFrameTypes === 'jp') {
    const intFrameId = `int${paddedFrameNumber}`;
    if (frameIsDefined(intFrameId)) {
      return intFrameId;
    }
  }

  // for custom frames first fall back to the xxx01 frame...
  const firstFrameId = `${savFrameTypes}01`;
  if (frameIsDefined(firstFrameId)) {
    return firstFrameId;
  }

  // ... and try the int frames last
  if (savFrameTypes !== 'jp') {
    const intFrameId = `int${paddedFrameNumber}`;
    if (frameIsDefined(intFrameId)) {
      return intFrameId;
    }
  }

  return 'int01';
};

export default mapCartFrameToName;
