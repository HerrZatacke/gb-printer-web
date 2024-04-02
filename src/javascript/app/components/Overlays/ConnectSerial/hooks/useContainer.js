import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../../../store/actions';

const useContainer = () => {

  const lightBoxOpen = useSelector((state) => (!!state.showSerials && !!state.useSerials));
  const dispatch = useDispatch();
  const setHideSerials = () => {
    dispatch({
      type: Actions.SHOW_SERIALS,
      payload: false,
    });
  };

  return {
    lightBoxOpen,
    setHideSerials,
  };
};

export default useContainer;
