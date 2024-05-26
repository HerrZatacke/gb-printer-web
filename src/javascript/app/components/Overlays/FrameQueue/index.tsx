import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Lightbox from '../../Lightbox';
import { Actions } from '../../../store/actions';
import './index.scss';
import EditFrameForm from '../EditFrame/EditFrameForm';
import useEditFrame from '../EditFrame/useEditFrame';
import { saveFrameData } from '../../../../tools/applyFrame/frameData';
import { State } from '../../../store/State';
import { AddFrameAction } from '../../../../../types/actions/FrameActions';
import { FrageGroupNamesAction } from '../../../store/reducers/frameGroupNamesReducer';
import { FrameQueueCancelOneAction } from '../../../../../types/actions/QueueActions';

const FrameQueue = () => {
  const frame = useSelector((state: State) => state.frameQueue[0]);
  const [newGroupName, setNewGroupName] = useState('');
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

        dispatch<AddFrameAction>({
          type: Actions.ADD_FRAME,
          payload: {
            frame: {
              id: fullId,
              name: frameName,
              hash,
            },
            tempId: frame.tempId,
          },
        });

        if (newGroupName?.trim()) {
          dispatch<FrageGroupNamesAction>({
            type: Actions.NAME_FRAMEGROUP,
            payload: {
              id: frameGroup,
              name: newGroupName,
            },
          });
        }
      }}
      deny={() => {
        dispatch<FrameQueueCancelOneAction>({
          type: Actions.FRAMEQUEUE_CANCEL_ONE,
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
          fullId={fullId}
          frameGroupName={newGroupName}
          setFrameGroupName={setNewGroupName}
        />
      </div>
    </Lightbox>
  );
};

export default FrameQueue;
