import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../../../store/actions';
import { State } from '../../../../store/State';
import { ShowSerialsAction } from '../../../../store/reducers/showSerialsReducer';

interface UseWithStore {
  lightBoxOpen: boolean,
  hideSerials: () => void,
}

const useWithStore = (): UseWithStore => {

  const lightBoxOpen = useSelector((state: State) => (state.showSerials && state.useSerials));
  const dispatch = useDispatch();
  const hideSerials = () => {
    dispatch({
      type: Actions.SHOW_SERIALS,
      payload: false,
    } as ShowSerialsAction);
  };

  return {
    lightBoxOpen,
    hideSerials,
  };
};

export default useWithStore;
