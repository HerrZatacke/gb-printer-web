import useInteractionsStore from '../../../stores/interactionsStore';
import useStoragesStore from '../../../stores/storagesStore';
import type { LogItem } from '../../../stores/interactionsStore';

interface UseProgress {
  git: {
    messages: LogItem[],
    repoUrl: string,
    repo?: string,
    branch?: string,
  },
  dropbox: {
    messages: LogItem[],
    path: string,
  },
  confirm: () => void,
}

export const useProgress = (): UseProgress => {
  const { progressLog, resetProgressLog } = useInteractionsStore();
  const { gitStorage, dropboxStorage } = useStoragesStore();

  return {
    git: {
      messages: progressLog.git || [],
      repoUrl: `https://github.com/${gitStorage.owner}/${gitStorage.repo}/tree/${gitStorage.branch}`,
      repo: gitStorage.repo,
      branch: gitStorage.branch,
    },
    dropbox: {
      messages: progressLog.dropbox || [],
      path: dropboxStorage.path || '',
    },
    confirm: resetProgressLog,
  };
};

