const getRGBNFrames = ({ images }, { r, g, b, n }, defaultFrame) => {

  if (defaultFrame) {
    return {
      r: defaultFrame,
      g: defaultFrame,
      b: defaultFrame,
      n: defaultFrame,
    };
  }

  const imageR = images.find((img) => img.hash === r);
  const imageG = images.find((img) => img.hash === g);
  const imageB = images.find((img) => img.hash === b);
  const imageN = images.find((img) => img.hash === n);

  return {
    r: imageR ? imageR.frame : null,
    g: imageG ? imageG.frame : null,
    b: imageB ? imageB.frame : null,
    n: imageN ? imageN.frame : null,
  };
};

export default getRGBNFrames;
