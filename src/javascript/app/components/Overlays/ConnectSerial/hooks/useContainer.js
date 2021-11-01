import { useDispatch, useSelector } from 'react-redux';
import { SHOW_SERIALS } from '../../../../store/actions';

const useContainer = () => {

  const lightBoxOpen = useSelector((state) => (!!state.showSerials && !!state.useSerials));
  const dispatch = useDispatch();
  const setHideSerials = () => {
    dispatch({
      type: SHOW_SERIALS,
      payload: false,
    });
  };

  return {
    lightBoxOpen,
    setHideSerials,
  };
};

export default useContainer;
