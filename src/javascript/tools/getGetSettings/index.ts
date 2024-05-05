import { Dispatch, MiddlewareAPI } from 'redux';
import { definitions, ExportTypes, StorePropertyExportable } from '../../app/store/defaults';
import getImages from './getImages';
import getFrames from './getFrames';
import getImageHashesForExport from './getImageHashesForExport';
import getFrameHashesForExport from './getFrameHashesForExport';
import { getEnv } from '../getEnv';
import getFrameGroups, { FrameGroup } from '../getFrameGroups';
import { State } from '../../app/store/State';
import { ExportableState, GetSettingsOptions, NoExport } from './types';
import { Image } from '../../../types/Image';
import { Frame } from '../../../types/Frame';
import { Palette } from '../../../types/Palette';

const getGetSettings = (store: MiddlewareAPI<Dispatch, State>) => async (
  what: ExportTypes,
  { lastUpdateUTC, selectedFrameGroup }: GetSettingsOptions = {},
): Promise<string> => {

  const frameSetID = selectedFrameGroup;

  const state = store.getState();

  const localStorageState: ExportableState = JSON.parse(localStorage.getItem('gbp-web-state') || '{}');

  // delete keys potentially containing passwords/tokens
  delete (localStorageState as NoExport).gitStorage;
  delete (localStorageState as NoExport).dropboxStorage;

  // Do not export the default '/' printerUrl for printer devices
  if (getEnv()?.env === 'esp8266') {
    delete (localStorageState as NoExport).printerUrl;
  }

  const exportableState: ExportableState = (definitions as StorePropertyExportable[])
    .reduce((acc: ExportableState, { saveExport, key }): ExportableState => {
      let outProp;

      if (saveExport.includes(what)) {
        outProp = localStorageState[key];

        if (key === 'images' && what === ExportTypes.SELECTED_IMAGES) {
          outProp = (outProp as Image[]).filter(({ hash }) => (
            getImageHashesForExport(what, state).includes(hash)
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
      const images = await getImages(getImageHashesForExport(what, state));
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
