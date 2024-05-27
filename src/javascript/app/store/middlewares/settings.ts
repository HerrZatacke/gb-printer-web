import { AnyAction, Dispatch } from 'redux';
import { download } from '../../../tools/download';
import cleanState from '../../../tools/cleanState';
import getGetSettings from '../../../tools/getGetSettings';
import mergeStates from '../../../tools/mergeStates';
import { localforageFrames, localforageImages } from '../../../tools/localforageInstance';
import { Actions } from '../actions';
import { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import { JSONExport, State } from '../State';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { ExportTypes } from '../../../consts/exportTypes';

const mergeSettings = (
  dispatch: Dispatch<AnyAction>,
  currentState: State,
  newSettings: JSONExport,
  mergeImagesFrames = false,
) => {
  Object.keys(newSettings).forEach((key: string) => {
    if (key !== 'state') {
      // import frames and images from JSON

      const exportProp: string = newSettings[key];

      if (key.match(/^[a-f0-9]{40,}$/gi)) {
        localforageImages.setItem(`${key}`, exportProp);
      } else if (key.startsWith('frame-')) {
        localforageFrames.setItem(`${key.split('frame-').pop()}`, exportProp);
      }
    }
  });

  cleanState(mergeStates(currentState, newSettings.state || {}, mergeImagesFrames))
    .then((cleanedState) => {
      dispatch<GlobalUpdateAction>({
        type: Actions.GLOBAL_UPDATE,
        payload: cleanedState,
      });
    });
};

const settings: MiddlewareWithState = (store) => {
  const getSettings = getGetSettings(store);

  const downloadSettings = async (what: ExportTypes, selectedFrameGroup = '') => {
    const currentSettings = await getSettings(what, { selectedFrameGroup });
    const filename = what === 'frames' ? 'frames' : [what, selectedFrameGroup].filter(Boolean).join('_');

    download(null)([{
      blob: new Blob(new Array(currentSettings)),
      filename: `${filename}.json`,
    }]);
  };

  return (next) => (action) => {
    switch (action.type) {
      case Actions.JSON_EXPORT:
        downloadSettings(action.payload, action.selectedFrameGroup);
        break;
      case Actions.JSON_IMPORT:
        mergeSettings(store.dispatch, store.getState(), action.payload, true);
        break;
      case Actions.GIT_SETTINGS_IMPORT:
      case Actions.DROPBOX_SETTINGS_IMPORT:
        mergeSettings(store.dispatch, store.getState(), action.payload, false);
        break;
      default:
        break;
    }

    next(action);
  };
};

export default settings;
