import Queue from 'promise-queue';
import useInteractionsStore from '../../app/stores/interactionsStore';
import useSettingsStore from '../../app/stores/settingsStore';
import useStoragesStore from '../../app/stores/storagesStore';
import OctoClient from './OctoClient';
import getUploadFiles from '../getUploadFiles';
import saveLocalStorageItems from '../saveLocalStorageItems';
import { delay } from '../delay';
import type { AddToQueueFn, GitStorageSettings } from '../../../types/Sync';
import type { JSONExportState } from '../../../types/ExportState';
import type { GitSyncTool } from './index';

let octoClient: OctoClient;
let addToQueue: (who: string) => AddToQueueFn<unknown>;

export const init = () => {
  const { gitStorage: gitStorageSettings } = useStoragesStore.getState();

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


export const gitSyncTool = (
  remoteImport: (repoContents: JSONExportState) => Promise<void>,
): GitSyncTool => {
  const { setProgressLog, setSyncBusy, setSyncSelect } = useInteractionsStore.getState();
  const { syncLastUpdate } = useStoragesStore.getState();

  const updateSettings = async (gitSettings: GitStorageSettings) => {
    await octoClient.setOctokit(gitSettings);
  };

  const startSyncData = async (direction: 'up' | 'down') => {
    setSyncBusy(true);
    setSyncSelect(false);

    try {
      const repoContents = await octoClient.getRepoContents();

      switch (direction) {
        case 'up': {
          const lastUpdateUTC = syncLastUpdate?.local || Math.floor((new Date()).getTime() / 1000);
          const repoTasks = await getUploadFiles(repoContents, lastUpdateUTC, addToQueue('GBPrinter'));
          await octoClient.updateRemoteStore(repoTasks);
          break;
        }

        case 'down': {
          await saveLocalStorageItems(repoContents);
          remoteImport(repoContents.settings);

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
  };

  useStoragesStore.subscribe((state) => state.gitStorage, updateSettings);

  return {
    startSyncData,
    updateSettings,
  };
};
