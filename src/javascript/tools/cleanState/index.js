import cleanUrl from '../cleanUrl';
import { defaultPalette } from '../../app/defaults';

const cleanState = (initialState) => {
  const palettesShorts = initialState.palettes.map(({ shortName }) => shortName);

  const socketUrl = cleanUrl(initialState.socketUrl, 'ws');
  const printerUrl = cleanUrl(initialState.printerUrl, 'http');

  const images = initialState.images
    .map((image) => {

      // eslint-disable-next-line no-param-reassign
      image.tags = image.tags || [];

      // image is a rgbn image
      if (image.hashes) {
        if (!image.palette) {
          return {
            ...image,
            palette: defaultPalette,
          };
        }

        return image;
      }

      // image is a greyscale image
      if (image.palette) {
        // if palette does not exist, update image to use default (first of list)
        return (!palettesShorts.includes(image.palette)) ?
          { ...image, palette: palettesShorts[0] } :
          image;
      }

      // image is neither rgbn nor default???
      return null;
    })
    .filter(Boolean);


  // assign index to images with no or duplicate index
  images
    .filter((image, imageIndex) => {
      if (!image.index) {
        return true;
      }

      return images.findIndex(({ index }) => index === image.index) !== imageIndex;
    }).forEach((image) => {
      // eslint-disable-next-line no-param-reassign
      image.index = initialState.globalIndex;
      // eslint-disable-next-line no-param-reassign
      initialState.globalIndex += 1;
    });

  return { ...initialState, images, socketUrl, printerUrl };
};

export default cleanState;
