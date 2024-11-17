import type { AnyAction, Dispatch } from 'redux';
import useItemsStore from '../../app/stores/itemsStore';
import { download } from '../download';
import cleanState from '../cleanState';
import getGetSettings from '../getGetSettings';
import mergeStates from '../mergeStates';
import { localforageFrames, localforageImages } from '../localforageInstance';
import { Actions } from '../../app/store/actions';
import type { JSONExport, JSONExportState, State, TypedStore } from '../../app/store/State';
import type { GlobalUpdateAction } from '../../../types/GlobalUpdateAction';
import type { ExportTypes } from '../../consts/exportTypes';

const mergeSettings = (
  dispatch: Dispatch<AnyAction>,
  currentState: State,
  newSettings: JSONExport | JSONExportState,
  mergeImagesFrames = false,
) => {
  const { frames, palettes } = useItemsStore.getState();

  Object.keys(newSettings).forEach((key: string) => {
    if (key !== 'state') {
      // import frames and images from JSON

      const exportProp: string = (newSettings as JSONExport)[key];

      if (key.match(/^[a-f0-9]{40,}$/gi)) {
        localforageImages.setItem(`${key}`, exportProp);
      } else if (key.startsWith('frame-')) {
        localforageFrames.setItem(`${key.split('frame-').pop()}`, exportProp);
      }
    }
  });

  cleanState(mergeStates(frames, palettes, currentState, newSettings.state || {}, mergeImagesFrames))
    .then((cleanedState) => {
      dispatch<GlobalUpdateAction>({
        type: Actions.GLOBAL_UPDATE,
        payload: cleanedState,
      });
    });
};

export interface ImportExportSettings {
  downloadSettings: (what: ExportTypes, selectedFrameGroup?: string) => Promise<void>,
  jsonImport: (repoContents: JSONExport) => void,
  remoteImport: (repoContents: JSONExportState) => void,
}

export const importExportSettings = (store: TypedStore): ImportExportSettings => {
  const getSettings = getGetSettings(store);

  const downloadSettings = async (what: ExportTypes, selectedFrameGroup = ''): Promise<void> => {
    const currentSettings = await getSettings(what, { selectedFrameGroup });
    const filename = what === 'frames' ? 'frames' : [what, selectedFrameGroup].filter(Boolean).join('_');

    download(null)([{
      blob: new Blob(new Array(currentSettings)),
      filename: `${filename}.json`,
    }]);
  };

  const jsonImport = (repoContents: JSONExport): void => {
    mergeSettings(store.dispatch, store.getState(), repoContents, true);
  };

  const remoteImport = (repoContents: JSONExportState): void => {
    mergeSettings(store.dispatch, store.getState(), repoContents, false);
  };

  return {
    downloadSettings,
    jsonImport,
    remoteImport,
  };
};
