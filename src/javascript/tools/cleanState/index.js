const DEFAULT_GREYS = [0xff, 0xaa, 0x55, 0x00];

const cleanState = (initialState) => {
  const palettesShorts = initialState.palettes.map(({ shortName }) => shortName);

  const images = initialState.images
    .map((image) => {

      // image is a greyscale image
      if (image.palette) {
        // if palette does not exist, update image to use default (first of list)
        return (!palettesShorts.includes(image.palette)) ?
          { ...image, palette: palettesShorts[0] } :
          image;
      }

      // image is a rgbn image
      if (image.hashes) {
        if (!image.rgbnPalette) {
          return {
            ...image,
            rgbnPalette: {
              r: DEFAULT_GREYS.slice(),
              g: DEFAULT_GREYS.slice(),
              b: DEFAULT_GREYS.slice(),
              n: DEFAULT_GREYS.slice(),
            },
          };
        }

        return image;
      }

      // image is neither rgbn nor default???
      return null;
    })
    .filter(Boolean);

  return { ...initialState, images };
};

export default cleanState;
