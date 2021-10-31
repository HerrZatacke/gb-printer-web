import dayjs from 'dayjs';
import predefinedPalettes from 'gb-palettes';
import { dateFormat, defaultRGBNPalette } from '../../app/defaults';
import uniqueBy from '../unique/by';
import cleanUrl from '../cleanUrl';
import { blendModeKeys } from '../RGBNDecoder/blendModes';

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

  const printerUrl = cleanUrl(dirtyState.printerUrl, 'http');
  let framesMessage = dirtyState.framesMessage;

  const activePalette = palettesShorts.includes(dirtyState.activePalette) ? dirtyState.activePalette : 'bw';

  const images = dirtyState.images
    // clean the created date (add ms)
    .map((image) => ({
      ...image,
      created: dayjs(image.created).format(dateFormat),
    }))

    // add tags array if missing
    .map((image) => ({
      ...image,
      tags: image.tags || [],
    }))

    // clean palettes
    .map((image) => {
      // image is a rgbn image
      if (image.hashes) {
        if (!image.palette) {
          return {
            ...image,
            palette: defaultRGBNPalette,
          };
        }

        if (!image.palette.blend) {
          return {
            ...image,
            palette: {
              ...image.palette,
              blend: blendModeKeys.MULTIPLY,
            },
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

  const plugins = dirtyState.plugins.map((plugin) => ({
    ...plugin,
    loading: true,
    error: undefined,
  }));

  const syncLastUpdate = {
    ...dirtyState.syncLastUpdate,
    dropbox: dirtyState.syncLastUpdate?.dropbox || 0,
    local: dirtyState.syncLastUpdate?.local || 0,
  };

  return {
    ...dirtyState,
    syncLastUpdate,
    images,
    palettes,
    plugins,
    printerUrl,
    framesMessage,
    activePalette,
    recentImports,
  };
};

export default cleanState;
