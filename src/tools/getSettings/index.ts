import { ExportTypes } from '@/consts/exportTypes';
import { getQueryClient } from '@/contexts/QueryClient';
import { getFrameGroups } from '@/hooks/useFrameGroups';
import { frameGroupsListQueryOptions } from '@/stores/items/queries/frameGroups';
import { framesListQueryOptions } from '@/stores/items/queries/frames';
import { imageGroupsListQueryOptions } from '@/stores/items/queries/imageGroups';
import { imagesListQueryOptions } from '@/stores/items/queries/images';
import { palettesListQueryOptions } from '@/stores/items/queries/palettes';
import { pluginsListQueryOptions } from '@/stores/items/queries/plugins';
import { useFiltersStore, ITEMS_STORE_VERSION } from '@/stores/stores';
import { Date } from '@/tools/safeDate';
import { type ExportableState, type JSONExport, type JSONExportBinary, type ExportableValues } from '@/types/ExportState';
import { type GetSettingsOptions } from '@/types/Sync';
import getFrames from './getFrames';
import getFramesForExport from './getFramesForExport';
import getImageHashesForExport from './getImageHashesForExport';
import getImages from './getImages';

type ExportableKey = keyof ExportableValues;

const imageExportTypes: ExportTypes[] = [
  ExportTypes.IMAGES,
  ExportTypes.SELECTED_IMAGES,
  ExportTypes.ALL,
];

const frameExportTypes: ExportTypes[] = [
  ExportTypes.FRAMES,
  ExportTypes.CURRENT_FRAMEGROUP,
  ExportTypes.ALL,
];

const getExportKeys = (what: ExportTypes): ExportableKey[] => {
  switch (what) {
    case ExportTypes.ALL:
    case ExportTypes.JSON_EXPORT:
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

export const getSettings = async (
  what: ExportTypes,
  { lastUpdateUTC, selectedFrameGroup }: GetSettingsOptions = {},
): Promise<string> => {
  const queryClient = getQueryClient();
  // get all possible exportable properties
  const { imageSelection } = useFiltersStore.getState();
  const { items: palettes } = await queryClient.fetchQuery(palettesListQueryOptions());
  const { items: plugins } = await queryClient.fetchQuery(pluginsListQueryOptions());
  const { items: frames } = await queryClient.fetchQuery(framesListQueryOptions());
  const { items: frameGroups } = await queryClient.fetchQuery(frameGroupsListQueryOptions());
  const { items: images } = await queryClient.fetchQuery(imagesListQueryOptions());
  const { items: imageGroups } = await queryClient.fetchQuery(imageGroupsListQueryOptions());

  console.log({ imageGroups, images });

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
    imageExportTypes.includes(what)
  ) {
    exportBinary = {
      ...exportBinary,
      ...await getImages(exportableState.images),
    };
  }

  if (
    exportableState.frames?.length &&
    frameExportTypes.includes(what)
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
