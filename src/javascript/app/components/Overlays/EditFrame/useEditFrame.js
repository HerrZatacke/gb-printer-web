import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CANCEL_EDIT_FRAME, UPDATE_FRAME } from '../../../store/actions';
import getFrameGroups from '../../../../tools/getFrameGroups';

const useEditFrame = (frame) => {
  const updateId = frame.id;
  const frames = useSelector((state) => state.frames);
  const groups = getFrameGroups(frames);
  const frameGroupIdRegex = /^(?<groupName>[a-z]+)(?<id>[0-9]+)/g;
  const dispatch = useDispatch();

  const match = frameGroupIdRegex.exec(frame.id);
  const groupName = match?.groups?.groupName || '';
  const id = match?.groups?.id || '0';

  const [frameGroup, setFrameGroup] = useState(groupName);
  const [frameIndex, setFrameIndex] = useState(parseInt(id, 10));
  const [frameName, setFrameName] = useState(frame.name);
  const fullId = `${frameGroup}${frameIndex.toString(10).padStart(2, '0')}`;

  const idIsSelf = fullId === updateId;
  const idValid = idIsSelf || !(frames.find((findFrame) => (fullId === findFrame.id)));

  const groupIdValid = Boolean(frameGroup.match(/^[a-z]{2,}$/g));

  const frameIndexValid = frameIndex > 0;

  const formValid = (
    idValid &&
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
    setFrameIndex: (fi) => setFrameIndex(parseInt(fi, 10)),
    frameGroup,
    setFrameGroup,
    frameName,
    setFrameName,
    idValid,
    formValid,
    groupIdValid,
    frameIndexValid,
  };
};

export default useEditFrame;
