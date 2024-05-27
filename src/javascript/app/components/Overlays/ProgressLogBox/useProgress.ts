import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../../store/actions';
import { State } from '../../../store/State';
import { LogClearAction, LogItem } from '../../../../../types/actions/LogActions';

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
  const progressState = useSelector((state: State) => ({
    git: {
      messages: state.progressLog.git || [],
      repoUrl: `https://github.com/${state.gitStorage.owner}/${state.gitStorage.repo}/tree/${state.gitStorage.branch}`,
      repo: state.gitStorage.repo,
      branch: state.gitStorage.branch,
    },
    dropbox: {
      messages: state.progressLog.dropbox || [],
      path: state.dropboxStorage.path || '',
    },
  }));

  const dispatch = useDispatch();

  return {
    ...progressState,
    confirm: () => {
      dispatch<LogClearAction>({
        type: Actions.LOG_CLEAR,
      });
    },
  };
};

