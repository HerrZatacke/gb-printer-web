import Queue from 'promise-queue';
import type { AnyAction } from 'redux';
import useInteractionsStore from '../../../stores/interactionsStore';
import useSettingsStore from '../../../stores/settingsStore';
import OctoClient from '../../../../tools/OctoClient';
import getUploadFiles from '../../../../tools/getUploadFiles';
import saveLocalStorageItems from '../../../../tools/saveLocalStorageItems';
import { Actions } from '../../actions';
import type { AddToQueueFn } from '../../../../../types/Sync';
import type { TypedStore } from '../../State';
import type { GitSettingsImportAction } from '../../../../../types/actions/StorageActions';
import { delay } from '../../../../tools/delay';

let octoClient: OctoClient;
let addToQueue: (who: string) => AddToQueueFn<unknown>;

export const init = (store: TypedStore) => {
  const { gitStorage: gitStorageSettings } = store.getState();

  const getPreferredLocale = () => (
    useSettingsStore.getState().preferredLocale
  );

  const { setProgressLog } = useInteractionsStore.getState();

  const queue = new Queue(1, Infinity);
  addToQueue = (who: string): AddToQueueFn<unknown> => (what, throttle, fn) => (
    queue.add(async () => {
      await delay(throttle);
      setProgressLog('git', {
        timestamp: (new Date()).getTime() / 1000,
        message: `${who} runs ${what}`,
      });

      return fn();
    })
  );

  octoClient = new OctoClient(gitStorageSettings, getPreferredLocale, addToQueue('OctoClient'));
};


export const middleware = (store: TypedStore) => async (action: AnyAction) => {
  const { setProgressLog, setSyncBusy, setSyncSelect } = useInteractionsStore.getState();

  if (
    action.type === Actions.STORAGE_SYNC_START &&
    action.payload.storageType === 'git'
  ) {
    setSyncBusy(true);
    setSyncSelect(false);
    const state = store.getState();

    try {
      const repoContents = await octoClient.getRepoContents();

      switch (action.payload.direction) {
        case 'up': {
          const lastUpdateUTC = state?.syncLastUpdate?.local || Math.floor((new Date()).getTime() / 1000);
          const repoTasks = await getUploadFiles(store, repoContents, lastUpdateUTC, addToQueue('GBPrinter'));
          await octoClient.updateRemoteStore(repoTasks);
          break;
        }

        case 'down': {
          await saveLocalStorageItems(repoContents);
          store.dispatch<GitSettingsImportAction>({
            type: Actions.GIT_SETTINGS_IMPORT,
            payload: repoContents.settings,
          });
          break;
        }

        default:
          throw new Error('github sync: wrong sync case');
      }

      setProgressLog('git', {
        timestamp: (new Date()).getTime() / 1000,
        message: '.',
      });
      setSyncBusy(false);

    } catch (error) {
      console.error(error);
      useInteractionsStore.getState().setError(error as Error);
    }

  } else if (action.type === Actions.SET_GIT_STORAGE) {
    octoClient.setOctokit(action.payload);
  }
};
