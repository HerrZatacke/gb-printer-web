import dayjs from 'dayjs';
import predefinedPalettes from 'gb-palettes';
import { BlendMode } from 'gb-image-decoder';
import { dateFormat, defaultRGBNPalette } from '../../app/defaults';
import uniqueBy from '../unique/by';
import hashFrames from './hashFrames';
import backupFrames from './backupFrames';
import type { State } from '../../app/store/State';
import type { Palette } from '../../../types/Palette';
import { isRGBNImage } from '../isRGBNImage';
import type { Image, MonochromeImage, RGBNImage } from '../../../types/Image';
import { GalleryViews } from '../../consts/GalleryViews';

const cleanState = async (dirtyState: Partial<State>): Promise<Partial<State>> => {

  const palettes: Palette[] = uniqueBy<Palette>('shortName')([
    ...predefinedPalettes.map((gbPalette): Palette => ({
      shortName: gbPalette.shortName,
      palette: gbPalette.palette,
      name: gbPalette.name,
      origin: gbPalette.origin,
      isPredefined: true,
    })),
    ...(dirtyState.palettes || []),
  ]);

  const galleryView = (
    dirtyState.galleryView &&
    Object.values(GalleryViews).includes(dirtyState.galleryView)
  ) ?
    dirtyState.galleryView : GalleryViews.GALLERY_VIEW_1X;

  const palettesShorts = palettes.map(({ shortName }) => shortName);
  const frameIds = (dirtyState.frames || []).map(({ id }) => id);

  let framesMessage = dirtyState.framesMessage;

  const images: Image[] = (dirtyState.images || [])
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

      if (typeof monoImage.framePalette === 'undefined') {
        if (monoImage.lockFrame) {
          Object.assign(monoImage, { framePalette: 'bw' });
        } else {
          Object.assign(monoImage, { framePalette: monoImage.palette });
        }
      }

      if (typeof monoImage.lockFrame === 'undefined') {
        Object.assign(monoImage, { lockFrame: false });
      }

      if (typeof monoImage.invertFramePalette === 'undefined') {
        Object.assign(monoImage, { invertFramePalette: monoImage.invertPalette });
      }

      monoImage.frame = image.frame || undefined;
      return monoImage;
    });

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

  const plugins = (dirtyState.plugins || []).map((plugin) => ({
    ...plugin,
    loading: true,
    error: undefined,
  }));

  const syncLastUpdate = {
    ...dirtyState.syncLastUpdate,
    dropbox: dirtyState.syncLastUpdate?.dropbox || 0,
    local: dirtyState.syncLastUpdate?.local || 0,
  };

  if (dirtyState.frames) {
    await backupFrames(dirtyState.frames);
  }

  const hashedFrames = await hashFrames(dirtyState.frames || []);

  return {
    ...dirtyState,
    frames: hashedFrames || dirtyState.frames,
    syncLastUpdate,
    galleryView,
    images,
    palettes,
    plugins,
    framesMessage: framesMessage || 0,
  };
};

export default cleanState;
