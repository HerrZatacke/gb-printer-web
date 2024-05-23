import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../../store/actions';
import { State } from '../../../store/State';
import { UseSerialsAction } from '../../../store/reducers/useSerialsReducer';

export interface UseSerials {
  enabled: boolean,
  enableSerials: (enable: boolean) => void,
}

const useSerials = (): UseSerials => {
  const enabled = useSelector((state: State) => state.useSerials);
  const dispatch = useDispatch();

  const enableSerials = (enable: boolean) => {
    dispatch({
      type: Actions.USE_SERIALS,
      payload: enable,
    } as UseSerialsAction);
  };

  return {
    enabled,
    enableSerials,
  };
};

export default useSerials;
