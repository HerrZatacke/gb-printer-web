import dayjs from 'dayjs';
import predefinedPalettes from 'gb-palettes';
import { BlendMode } from 'gb-image-decoder';
import { dateFormat, defaultRGBNPalette } from '../../app/defaults';
import uniqueBy from '../unique/by';
import cleanUrl from '../cleanUrl';
import hashFrames from './hashFrames';
import backupFrames from './backupFrames';
import { State } from '../../app/store/State';
import { Palette } from '../../../types/Palette';
import { isRGBNImage } from '../isRGBNImage';
import { Image, MonochromeImage, RGBNImage } from '../../../types/Image';

const cleanState = async (dirtyState: State) => {

  const palettes: Palette[] = uniqueBy<Palette>('shortName')([
    ...predefinedPalettes.map((gbPalette): Palette => ({
      shortName: gbPalette.shortName,
      palette: gbPalette.palette,
      name: gbPalette.name,
      origin: gbPalette.origin,
      isPredefined: true,
    })),
    ...dirtyState.palettes,
  ]);

  const palettesShorts = palettes.map(({ shortName }) => shortName);
  const frameIds = dirtyState.frames.map(({ id }) => id);

  const printerUrl = cleanUrl(dirtyState.printerUrl, 'http');
  let framesMessage = dirtyState.framesMessage;

  const activePalette = palettesShorts.includes(dirtyState.activePalette || '') ? dirtyState.activePalette : 'bw';

  const images: Image[] = dirtyState.images
    // clean the created date (add ms) (e.g. "2021-01-30 18:16:09" -> "2021-01-30 18:16:09:000")
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
    .map((image): Image => {
      // image is a rgbn image
      if (isRGBNImage(image)) {
        const rgbnImage = { ...image as RGBNImage };

        if (!rgbnImage.palette) {
          Object.assign(rgbnImage, { palette: defaultRGBNPalette });
        }

        if (!rgbnImage.palette.blend) {
          Object.assign(rgbnImage.palette, { blend: BlendMode.MULTIPLY });
        }

        rgbnImage.frame = image.frame || undefined;
        return rgbnImage as Image;
      }

      // image is a greyscale image
      const monoImage = { ...image as MonochromeImage };
      // if palette does not exist, update image to use default (first of list)
      if (!palettesShorts.includes(monoImage.palette) && !monoImage.palette) {
        Object.assign(monoImage, { palette: palettesShorts[0] || 'bw' });
      }

      monoImage.frame = image.frame || undefined;
      return monoImage;
    });

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

  await backupFrames(dirtyState.frames);

  const hashedFrames = await hashFrames(dirtyState.frames);

  return {
    ...dirtyState,
    frames: hashedFrames || dirtyState.frames,
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
