import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Lightbox from '../../Lightbox';
import { ADD_FRAME, FRAMEQUEUE_CANCEL_ONE } from '../../../store/actions';
import './index.scss';
import EditFrameForm from '../EditFrame/EditFrameForm';
import useEditFrame from '../EditFrame/useEditFrame';
import { saveFrameData } from '../../../../tools/applyFrame/frameData';

const FrameQueue = () => {
  const frame = useSelector((store) => store.frameQueue[0]);
  const dispatch = useDispatch();

  const {
    fullId,
    formValid,
    groups,
    frameGroup,
    frameIndex,
    setFrameIndex,
    frameName,
    setFrameGroup,
    setFrameName,
    idValid,
    groupIdValid,
    frameIndexValid,
  } = useEditFrame({
    id: '',
    name: frame.fileName,
  });

  return (
    <Lightbox
      className="import-overlay"
      header={`Import new Frame as "${fullId}"`}
      canConfirm={formValid}
      confirm={async () => {
        const hash = await saveFrameData(frame.tiles);

        dispatch({
          type: ADD_FRAME,
          payload: {
            id: fullId,
            name: frameName,
            hash,
            tempId: frame.tempId,
          },
        });
      }}
      deny={() => {
        dispatch({
          type: FRAMEQUEUE_CANCEL_ONE,
          payload: frame,
        });
      }}
    >
      <div
        className="import-overlay__content"
      >
        <EditFrameForm
          frameIndex={frameIndex}
          setFrameGroup={setFrameGroup}
          frameName={frameName}
          frameGroup={frameGroup}
          setFrameName={setFrameName}
          groupIdValid={groupIdValid}
          idValid={idValid}
          frameIndexValid={frameIndexValid}
          setFrameIndex={setFrameIndex}
          groups={groups}
        />
      </div>
    </Lightbox>
  );
};

export default FrameQueue;
