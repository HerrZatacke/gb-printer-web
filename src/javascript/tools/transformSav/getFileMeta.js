const getFileMeta = (data, baseAddress) => {
  const cartIndex = (baseAddress / 0x1000) - 2;
  const albumIndex = cartIndex >= 0 ? data[0x11b2 + cartIndex] : 64;
  const frameNumber = data[baseAddress + 0xfb0];

  return {
    cartIndex,
    albumIndex,
    baseAddress,
    frameNumber,
  };
};

export default getFileMeta;
