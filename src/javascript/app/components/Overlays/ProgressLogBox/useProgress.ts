import { useSelector } from 'react-redux';
import useInteractionsStore from '../../../stores/interactionsStore';
import type { State } from '../../../store/State';
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

  const progressState = useSelector((state: State) => ({
    git: {
      messages: progressLog.git || [],
      repoUrl: `https://github.com/${state.gitStorage.owner}/${state.gitStorage.repo}/tree/${state.gitStorage.branch}`,
      repo: state.gitStorage.repo,
      branch: state.gitStorage.branch,
    },
    dropbox: {
      messages: progressLog.dropbox || [],
      path: state.dropboxStorage.path || '',
    },
  }));

  return {
    ...progressState,
    confirm: resetProgressLog,
  };
};

