import useFiltersStore from '../../app/stores/filtersStore';
import { definitions } from '../../app/store/defaults';
import { ExportTypes } from '../../consts/exportTypes';
import getImages from './getImages';
import getFrames from './getFrames';
import getImageHashesForExport from './getImageHashesForExport';
import getFrameHashesForExport from './getFrameHashesForExport';
import getFrameGroups from '../getFrameGroups';
import type { StorePropertyExportable } from '../../app/store/defaults';
import type { ExportableState, TypedStore } from '../../app/store/State';
import type { GetSettingsOptions } from '../../../types/Sync';
import type { Image } from '../../../types/Image';
import type { Frame } from '../../../types/Frame';
import type { Palette } from '../../../types/Palette';
import type { FrameGroup } from '../../../types/FrameGroup';

const getGetSettings = (store: TypedStore) => async (
  what: ExportTypes,
  { lastUpdateUTC, selectedFrameGroup }: GetSettingsOptions = {},
): Promise<string> => {

  const frameSetID = selectedFrameGroup;

  const state = store.getState();

  const { imageSelection } = useFiltersStore.getState();

  const localStorageState: ExportableState = JSON.parse(localStorage.getItem('gbp-web-state') || '{}');

  const exportableState: ExportableState = (definitions as StorePropertyExportable[])
    .reduce((acc: ExportableState, { saveExport, key }): ExportableState => {
      let outProp;

      if (saveExport.includes(what)) {
        outProp = localStorageState[key];

        if (key === 'images' && what === ExportTypes.SELECTED_IMAGES) {
          outProp = (outProp as Image[]).filter(({ hash }) => (
            getImageHashesForExport(what, state, imageSelection).includes(hash)
          ));
        }

        if (key === 'frames' && what === ExportTypes.FRAMEGROUP) {
          outProp = (outProp as Frame[]).filter(({ hash }) => (
            getFrameHashesForExport(what, state, frameSetID).includes(hash)
          ));
        }

        // Remove unused framegroups from export
        if (key === 'frameGroupNames') {
          if (what === ExportTypes.FRAMEGROUP) {
            outProp = (outProp as FrameGroup[]).filter((group) => group.id === frameSetID);
          } else {
            outProp = getFrameGroups(state.frames, (outProp as FrameGroup[]));
          }
        }


        if (key === 'palettes') {
          outProp = (outProp as Palette[]).filter(({ isPredefined }) => !isPredefined);
        }
      }

      return outProp ? {
        ...acc,
        [key]: outProp,
      } : acc;
    }, {});

  exportableState.lastUpdateUTC = lastUpdateUTC || Math.floor((new Date()).getTime() / 1000);

  switch (what) {
    case ExportTypes.DEBUG:
      return JSON.stringify({ state: localStorageState }, null, 2);
    case ExportTypes.SETTINGS:
    case ExportTypes.REMOTE:
      return JSON.stringify({ state: exportableState }, null, 2);
    case ExportTypes.IMAGES:
    case ExportTypes.SELECTED_IMAGES: {
      if (!exportableState.images) {
        return JSON.stringify({ state: exportableState }, null, 2);
      }

      const images = await getImages(exportableState.images);
      return JSON.stringify({
        state: exportableState,
        ...images,
      }, null, 2);
    }

    case ExportTypes.FRAMES:
    case ExportTypes.FRAMEGROUP: {
      const frames = await getFrames(getFrameHashesForExport(what, state, frameSetID));
      return JSON.stringify({
        state: exportableState,
        ...frames,
      }, null, 2);
    }

    case ExportTypes.PALETTES: {
      const palettes = await Promise.resolve(exportableState.palettes);
      return JSON.stringify({
        state: {
          palettes,
        },
      }, null, 2);
    }

    default:
      return '{}';
  }
};

export default getGetSettings;
