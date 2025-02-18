// import useFiltersStore from '../../app/stores/filtersStore';
import type { Values } from '../../app/stores/itemsStore';
import useItemsStore, { ITEMS_STORE_VERSION } from '../../app/stores/itemsStore';
import useFiltersStore from '../../app/stores/filtersStore';
import { ExportTypes } from '../../consts/exportTypes';
import getImages from './getImages';
import getFrames from './getFrames';
import getImageHashesForExport from './getImageHashesForExport';
import getFramesForExport from './getFramesForExport';
import getFrameGroups from '../getFrameGroups';
import type { ExportableState, JSONExport, JSONExportBinary } from '../../../types/ExportState';
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
              frameGroups: (what === ExportTypes.CURRENT_FRAMEGROUP) ?
                frameGroups.filter((group) => group.id === selectedFrameGroup) :
                getFrameGroups(frames, frameGroups),
            };
          }

          case 'frames': {
            const whatFrames = (what === ExportTypes.FRAMES) ? ExportTypes.FRAMES : ExportTypes.CURRENT_FRAMEGROUP;
            return {
              ...acc,
              frames: getFramesForExport(whatFrames, frames, selectedFrameGroup),
            };
          }

          case 'imageGroups': {
            return { ...acc, imageGroups };
          }

          case 'images': {
            const whatImages = (what === ExportTypes.SELECTED_IMAGES) ? 'selected_images' : 'images';
            const exportImageHashes = getImageHashesForExport(whatImages, images, imageSelection);
            return {
              ...acc,
              images: images.filter(({ hash }) => (exportImageHashes.includes(hash))),
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

  let exportBinary: JSONExportBinary = {};

  if (
    exportableState.images?.length &&
    [
      ExportTypes.IMAGES,
      ExportTypes.SELECTED_IMAGES,
      ExportTypes.ALL,
    ].includes(what)
  ) {
    exportBinary = {
      ...exportBinary,
      ...await getImages(exportableState.images),
    };
  }

  if (
    exportableState.frames?.length &&
    [
      ExportTypes.FRAMES,
      ExportTypes.CURRENT_FRAMEGROUP,
      ExportTypes.ALL,
    ].includes(what)
  ) {
    const whatFrames = what === ExportTypes.CURRENT_FRAMEGROUP ? ExportTypes.CURRENT_FRAMEGROUP : ExportTypes.FRAMES;
    exportBinary = {
      ...exportBinary,
      ...await getFrames(getFramesForExport(whatFrames, frames, selectedFrameGroup).map(({ hash }) => hash)),
    };
  }

  const jsonExport = {
    state: exportableState,
    ...exportBinary,
  } as JSONExport;

  return JSON.stringify(jsonExport, null, 2);
};

export default getGetSettings;
