import cleanUrl from '../cleanUrl';
import { defaultPalette } from '../../app/defaults';

const cleanState = (dirtyState) => {
  const palettesShorts = dirtyState.palettes.map(({ shortName }) => shortName);
  const frameIds = dirtyState.frames.map(({ id }) => id);

  const socketUrl = cleanUrl(dirtyState.socketUrl, 'ws');
  const printerUrl = cleanUrl(dirtyState.printerUrl, 'http');
  let framesMessage = dirtyState.framesMessage;

  const images = dirtyState.images
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

  // If the user has at least one frame selected
  // but the frames are not yet imported, show a message hint
  images.forEach((image) => {
    if (
      !frameIds.includes(image.frame) &&
      !framesMessage // message not seen yet
    ) {
      framesMessage = 1;
    }
  });

  // assign index to images with no or duplicate index
  images
    .filter((image, imageIndex) => {
      if (!image.index) {
        return true;
      }

      return images.findIndex(({ index }) => index === image.index) !== imageIndex;
    }).forEach((image) => {
      // eslint-disable-next-line no-param-reassign
      image.index = dirtyState.globalIndex;
      // eslint-disable-next-line no-param-reassign
      dirtyState.globalIndex += 1;
    });

  return { ...dirtyState, images, socketUrl, printerUrl, framesMessage };
};

export default cleanState;
