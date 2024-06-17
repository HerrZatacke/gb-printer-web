import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../../../store/actions';
import type { State } from '../../../../store/State';
import type { ShowSerialsAction } from '../../../../../../types/actions/GlobalActions';

interface UseWithStore {
  lightBoxOpen: boolean,
  hideSerials: () => void,
}

const useWithStore = (): UseWithStore => {

  const lightBoxOpen = useSelector((state: State) => (state.showSerials && state.useSerials));
  const dispatch = useDispatch();
  const hideSerials = () => {
    dispatch<ShowSerialsAction>({
      type: Actions.SHOW_SERIALS,
      payload: false,
    });
  };

  return {
    lightBoxOpen,
    hideSerials,
  };
};

export default useWithStore;
