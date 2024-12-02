// import useFiltersStore from '../../app/stores/filtersStore';
import type { Values } from '../../app/stores/itemsStore';
import useItemsStore, { ITEMS_STORE_VERSION } from '../../app/stores/itemsStore';
import useFiltersStore from '../../app/stores/filtersStore';
import { ExportTypes } from '../../consts/exportTypes';
import getImages from './getImages';
import getFrames from './getFrames';
import getImageHashesForExport from './getImageHashesForExport';
import getFrameHashesForExport from './getFrameHashesForExport';
import getFrameGroups from '../getFrameGroups';
import type { ExportableState } from '../../../types/ExportState';
import type { GetSettingsOptions } from '../../../types/Sync';
// import type { Image } from '../../../types/Image';
// import type { Frame } from '../../../types/Frame';
// import type { Palette } from '../../../types/Palette';
// import type { FrameGroup } from '../../../types/FrameGroup';

// export interface StorePropertyDefault {
//   key: keyof ExportableState,
//   saveLocally: boolean,
//   saveExport: ExportTypes[],
//   value: unknown,
// }
//
// export interface StorePropertyExportable extends Omit<StorePropertyDefault, 'key'> {
//   key: keyof ExportableState,
// }

type ExportableKey = keyof Values;

const getExportKeys = (what: ExportTypes): ExportableKey[] => {
  switch (what) {
    case ExportTypes.ALL:
      return ['frameGroups', 'frames', 'imageGroups', 'images', 'palettes', 'plugins'];
    case ExportTypes.SELECTED_IMAGES:
      return ['images'];
    case ExportTypes.IMAGES:
      return ['images', 'imageGroups'];
    case ExportTypes.PALETTES:
      return ['palettes'];
    case ExportTypes.FRAMES:
    case ExportTypes.CURRENT_FRAMEGROUP:
      return ['frames', 'frameGroups'];
    case ExportTypes.PLUGINS:
      return ['plugins'];
    default:
      return [];
  }
};

const getGetSettings = () => async (
  what: ExportTypes,
  { lastUpdateUTC, selectedFrameGroup }: GetSettingsOptions = {},
): Promise<string> => {
  // get all possible exportable properties
  const { frames, images, palettes, imageGroups, frameGroups, plugins } = useItemsStore.getState();
  const { imageSelection } = useFiltersStore.getState();

  const exportableState: ExportableState = {
    ...getExportKeys(what)
      .reduce((acc: Partial<ExportableState>, key): Partial<ExportableState> => {
        switch (key) {
          case 'frameGroups': {
            return {
              ...acc,
              // Remove unused framegroups from export
              [key]: (what === ExportTypes.CURRENT_FRAMEGROUP) ?
                frameGroups.filter((group) => group.id === selectedFrameGroup) :
                getFrameGroups(frames, frameGroups),
            };
          }

          case 'frames': {
            const whatFrames = (what === ExportTypes.FRAMES) ? 'frames' : 'current_framegroup';
            const exportFrameHashes = getFrameHashesForExport(whatFrames, frames, selectedFrameGroup);
            return {
              ...acc,
              [key]: frames.filter(({ hash }) => (exportFrameHashes.includes(hash))),
            };
          }

          case 'imageGroups': {
            return { ...acc, imageGroups };
          }

          case 'images': {
            const whatImages = (what === ExportTypes.SELECTED_IMAGES) ? 'images' : 'selected_images';
            const exportImageHashes = getImageHashesForExport(whatImages, images, imageSelection);
            return {
              ...acc,
              [key]: images.filter(({ hash }) => (exportImageHashes.includes(hash))),
            };
          }

          case 'palettes': {
            return {
              ...acc,
              // Always remove predefined palettes from export
              palettes: palettes.filter(({ isPredefined }) => !isPredefined),
            };
          }

          case 'plugins': {
            return { ...acc, plugins };
          }

          default:
            return acc;
        }
      }, {}),
    lastUpdateUTC: lastUpdateUTC || Math.floor((new Date()).getTime() / 1000),
    version: ITEMS_STORE_VERSION,
  };

  switch (what) {
    case ExportTypes.IMAGES:
    case ExportTypes.SELECTED_IMAGES: {
      if (!exportableState.images) {
        return JSON.stringify({ state: exportableState }, null, 2);
      }

      const selectedImages = await getImages(exportableState.images);
      return JSON.stringify({
        state: exportableState,
        ...selectedImages,
      }, null, 2);
    }

    case ExportTypes.FRAMES:
    case ExportTypes.CURRENT_FRAMEGROUP: {
      const exportFrames = await getFrames(getFrameHashesForExport(what, frames, selectedFrameGroup));
      return JSON.stringify({
        state: exportableState,
        ...exportFrames,
      }, null, 2);
    }

    default:
      return JSON.stringify({ state: exportableState }, null, 2);
  }
};

export default getGetSettings;
