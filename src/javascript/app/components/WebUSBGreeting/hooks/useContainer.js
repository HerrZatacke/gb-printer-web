import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../../store/actions';

const useContainer = () => {
  const useSerials = useSelector((state) => state.useSerials);
  const dispatch = useDispatch();

  const setUseSerials = (payload) => {
    dispatch({
      type: Actions.USE_SERIALS,
      payload,
    });
  };

  return {
    useSerials,
    setUseSerials,
  };
};

export default useContainer;
