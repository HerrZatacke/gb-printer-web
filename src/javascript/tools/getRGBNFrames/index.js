const getRGBNFrames = (state, { r, g, b, n }, defaultFrame) => {

  if (defaultFrame) {
    return {
      r: defaultFrame,
      g: defaultFrame,
      b: defaultFrame,
      n: defaultFrame,
    };
  }

  const imageR = state.images.find((img) => img.hash === r);
  const imageG = state.images.find((img) => img.hash === g);
  const imageB = state.images.find((img) => img.hash === b);
  const imageN = state.images.find((img) => img.hash === n);

  return {
    r: imageR ? imageR.frame : null,
    g: imageG ? imageG.frame : null,
    b: imageB ? imageB.frame : null,
    n: imageN ? imageN.frame : null,
  };
};

export default getRGBNFrames;
