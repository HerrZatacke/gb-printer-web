import dayjs from 'dayjs';
import predefinedPalettes from 'gb-palettes';
import { defaultRGBNPalette } from '../../app/defaults';
import uniqueBy from '../unique/by';
import cleanUrl from '../cleanUrl';

const cleanState = (dirtyState) => {

  const palettes = uniqueBy('shortName')([
    ...predefinedPalettes.map((palette) => ({
      ...palette,
      isPredefined: true,
    })),
    ...dirtyState.palettes,
  ]);

  const palettesShorts = palettes.map(({ shortName }) => shortName);
  const frameIds = dirtyState.frames.map(({ id }) => id);

  const socketUrl = cleanUrl(dirtyState.socketUrl, 'ws');
  const printerUrl = cleanUrl(dirtyState.printerUrl, 'http');
  let framesMessage = dirtyState.framesMessage;

  const activePalette = palettesShorts.includes(dirtyState.activePalette) ? dirtyState.activePalette : 'bw';

  const images = dirtyState.images
    .map((image) => {

      // eslint-disable-next-line no-param-reassign
      image.tags = image.tags || [];

      // image is a rgbn image
      if (image.hashes) {
        if (!image.palette) {
          return {
            ...image,
            palette: defaultRGBNPalette,
          };
        }

        return image;
      }

      // image is a greyscale image
      if (image.palette) {
        // if palette does not exist, update image to use default (first of list)
        return (!palettesShorts.includes(image.palette)) ?
          {
            ...image,
            palette: palettesShorts[0] || 'bw',
          } :
          image;
      }

      // image is neither rgbn nor default???
      return null;
    })
    .filter(Boolean);

  const imageHashes = images.map(({ hash }) => hash);

  // If the user has at least one frame selected
  // but the frames are not yet imported, show a message hint
  images.forEach((image) => {
    if (
      image.frame &&
      !frameIds.includes(image.frame) &&
      !framesMessage // message not seen yet
    ) {
      framesMessage = 1;
    }
  });

  // remove items older than 6 hours from "recent imports"
  const yesterday = dayjs().subtract(6, 'hour').unix();
  const recentImports = dirtyState.recentImports.filter(({ hash, timestamp }) => (
    imageHashes.includes(hash) &&
    timestamp > yesterday
  ));

  return {
    ...dirtyState,
    images,
    palettes,
    socketUrl,
    printerUrl,
    framesMessage,
    activePalette,
    recentImports,
  };
};

export default cleanState;
