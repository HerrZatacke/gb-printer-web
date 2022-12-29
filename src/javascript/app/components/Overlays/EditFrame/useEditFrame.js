import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CANCEL_EDIT_FRAME, UPDATE_FRAME } from '../../../store/actions';
import getFrameGroups from '../../../../tools/getFrameGroups';

const useEditFrame = () => {
  const frame = useSelector((state) => state.frames.find(({ id }) => id === state.editFrame));
  const updateId = frame.id;
  const frames = useSelector((state) => state.frames);
  const groups = getFrameGroups(frames);
  const frameGroupIdRegex = /^(?<group>[a-z]+)(?<id>[0-9]+)/g;
  const { groups: { group, id } } = frameGroupIdRegex.exec(frame.id);
  const [frameGroup, setFrameGroup] = useState(group);
  const [frameIndex, setFrameIndex] = useState(parseInt(id, 10));
  const [frameName, setFrameName] = useState(frame.name);
  const dispatch = useDispatch();
  const fullId = `${frameGroup}${frameIndex.toString(10).padStart(2, '0')}`;

  const idExists = (
    (fullId !== updateId) &&
    frames.find((findFrame) => (fullId === findFrame.id))
  );

  const groupIdValid = frameGroup.match(/^[a-z]{2,}$/g);

  const frameIndexValid = frameIndex > 0;

  const formValid = (
    !idExists &&
    groupIdValid &&
    frameIndexValid
  );

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
          id: fullId,
          name: frameName,
        },
      },
    });
  };

  return {
    cancelEdit,
    saveFrame,
    groups,
    updateId,
    fullId,
    frameIndex,
    setFrameIndex,
    frameGroup,
    setFrameGroup,
    frameName,
    setFrameName,
    idExists,
    formValid,
    groupIdValid,
    frameIndexValid,
  };
};

export default useEditFrame;