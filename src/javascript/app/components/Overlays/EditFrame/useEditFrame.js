import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CANCEL_EDIT_FRAME, UPDATE_FRAME } from '../../../store/actions';

const useEditFrame = () => {
  const frame = useSelector((state) => state.frames.find(({ id }) => id === state.editFrame));
  const updateId = frame.id;
  const [frameId, setFrameId] = useState(frame.id);
  const [frameName, setFrameName] = useState(frame.name);
  const dispatch = useDispatch();

  const cancelEdit = () => {
    dispatch({
      type: CANCEL_EDIT_FRAME,
    });
  };

  const saveFrame = () => {
    dispatch({
      type: UPDATE_FRAME,
      payload: {
        updateId,
        data: {
          ...frame,
          id: frameId,
          name: frameName,
        },
      },
    });
  };

  return {
    cancelEdit,
    saveFrame,
    updateId,
    frameId,
    setFrameId,
    frameName,
    setFrameName,
  };
};

export default useEditFrame;
