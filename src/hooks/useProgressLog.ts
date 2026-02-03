import { type LogItem } from '@/stores/progressStore';
import { useProgressStore, useStoragesStore } from '@/stores/stores';

interface UseProgressLog {
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

export const useProgressLog = (): UseProgressLog => {
  const { progressLog, resetProgressLog } = useProgressStore();
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

