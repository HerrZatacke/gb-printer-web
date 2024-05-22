import Queue from 'promise-queue';
import { AnyAction } from 'redux';
import OctoClient from '../../../../tools/OctoClient';
import getUploadFiles from '../../../../tools/getUploadFiles';
import saveLocalStorageItems from '../../../../tools/saveLocalStorageItems';
import { Actions } from '../../actions';
import { AddToQueueFn } from '../../../../../types/Sync';
import { TypedStore } from '../../State';
import { delay } from '../../../../tools/delay';

let octoClient: OctoClient;
let addToQueue: (who: string) => AddToQueueFn<unknown>;

export const init = (store: TypedStore) => {
  const { gitStorage: gitStorageSettings } = store.getState();

  const getPreferredLocale = () => (
    store.getState().preferredLocale
  );

  const queue = new Queue(1, Infinity);
  addToQueue = (who: string): AddToQueueFn<unknown> => (what, throttle, fn) => (
    queue.add(async () => {
      await delay(throttle);
      store.dispatch({
        type: Actions.GITSTORAGE_LOG_ACTION,
        payload: {
          timestamp: (new Date()).getTime() / 1000,
          message: `${who} runs ${what}`,
        },
      });

      return fn();
    })
  );

  octoClient = new OctoClient(gitStorageSettings, getPreferredLocale, addToQueue('OctoClient'));
};


export const middleware = (store: TypedStore) => async (action: AnyAction) => {
  if (
    action.type === Actions.STORAGE_SYNC_START &&
    action.payload.storageType === 'git'
  ) {
    const state = store.getState();

    try {
      const repoContents = await octoClient.getRepoContents();
      let syncResult;

      switch (action.payload.direction) {
        case 'up': {
          const lastUpdateUTC = state?.syncLastUpdate?.local || Math.floor((new Date()).getTime() / 1000);
          const repoTasks = await getUploadFiles(store, repoContents, lastUpdateUTC, addToQueue('GBPrinter'));
          syncResult = await octoClient.updateRemoteStore(repoTasks);
          break;
        }

        case 'down': {
          syncResult = await saveLocalStorageItems(repoContents);
          store.dispatch({
            type: Actions.GIT_SETTINGS_IMPORT,
            payload: repoContents.settings,
          });
          break;
        }

        default:
          throw new Error('github sync: wrong sync case');
      }

      store.dispatch({
        type: Actions.STORAGE_SYNC_DONE,
        payload: {
          syncResult,
          storageType: 'git',
        },
      });

    } catch (error) {
      console.error(error);
      store.dispatch({
        type: Actions.ERROR,
        payload: (error as Error).message,
      });
    }

  } else if (action.type === Actions.SET_GIT_STORAGE) {
    octoClient.setOctokit(action.payload);
  }
};