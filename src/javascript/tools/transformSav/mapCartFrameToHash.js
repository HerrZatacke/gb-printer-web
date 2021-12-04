const mapCartFrameToHash = (frameNumber, savFrameTypes, frames) => {

  const findFrame = (frameId) => frames.find(({ id }) => id === frameId);

  const paddedFrameNumber = (frameNumber + 1).toString(10).padStart(2, '0');

  const exactFrameId = `${savFrameTypes}${paddedFrameNumber}`;
  const foundExactFrame = findFrame(exactFrameId);
  if (foundExactFrame?.hash) {
    return foundExactFrame.hash;
  }

  // for js frame, try to fall back to int frames, as jp/int share a lot
  if (savFrameTypes === 'jp') {
    const intFrameId = `int${paddedFrameNumber}`;
    const foundIntframe = findFrame(intFrameId);
    if (foundIntframe?.hash) {
      return foundIntframe.hash;
    }
  }

  // for custom frames first fall back to the xxx01 frame...
  const firstFrameId = `${savFrameTypes}01`;
  const foundFirstFrame = findFrame(firstFrameId);
  if (foundFirstFrame?.hash) {
    return foundFirstFrame.hash;
  }

  // ... and try the int frames last
  if (savFrameTypes !== 'jp') {
    const intFrameId = `int${paddedFrameNumber}`;
    const foundIntFrame = findFrame(intFrameId);
    if (foundIntFrame?.hash) {
      return foundIntFrame.hash;
    }
  }

  return findFrame('int01')?.hash || null;
};

export default mapCartFrameToHash;
