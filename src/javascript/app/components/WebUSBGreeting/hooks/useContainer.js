import { useDispatch, useSelector } from 'react-redux';

const useContainer = () => {
  const useSerials = useSelector((state) => state.useSerials);
  const dispatch = useDispatch();

  const setUseSerials = (payload) => {
    dispatch({
      type: 'USE_SERIALS',
      payload,
    });
  };

  return {
    useSerials,
    setUseSerials,
  };
};

export default useContainer;
