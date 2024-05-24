import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../../store/State';
import { GitStorageAction, GitStorageSettings } from '../../../../../../types/actions/StorageActions';
import { Actions } from '../../../../store/actions';

interface UseGitStorage {
  gitStorage: GitStorageSettings,
  setGitStorage: (settings: GitStorageSettings) => void,
}

export const useGitStorage = (): UseGitStorage => {
  const gitStorage: GitStorageSettings = useSelector((state: State) => state.gitStorage);
  const dispatch = useDispatch();

  const setGitStorage = (settings: GitStorageSettings) => {
    dispatch({
      type: Actions.SET_GIT_STORAGE,
      payload: settings,
    } as GitStorageAction);
  };

  return {
    gitStorage,
    setGitStorage,
  };
};
