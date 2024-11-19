import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Lightbox from '../../Lightbox';
import { Actions } from '../../../store/actions';
import './index.scss';
import EditFrameForm from '../EditFrame/EditFrameForm';
import useEditFrame from '../EditFrame/useEditFrame';
import { saveFrameData } from '../../../../tools/applyFrame/frameData';
import type { AddFrameAction } from '../../../../../types/actions/FrameActions';
import EditFrameStartLine from '../EditFrameStartLine';
import useImportsStore from '../../../stores/importsStore';
import useItemsStore from '../../../stores/itemsStore';
import useStoragesStore from '../../../stores/storagesStore';

function FrameQueue() {
  const { frameQueue, frameQueueCancelOne } = useImportsStore();
  const { setSyncLastUpdate } = useStoragesStore();
  const { updateFrameGroups } = useItemsStore();
  const frame = frameQueue[0];
  const [newGroupName, setNewGroupName] = useState('');
  const [startLine, setStartLine] = useState<number>(Math.floor((frame.tiles.length - 280) / 40));
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
    hash: '',
    name: frame.fileName,
  });

  return (
    <Lightbox
      className="import-overlay"
      header={`Import new Frame as "${fullId}"`}
      canConfirm={formValid}
      confirm={async () => {
        const hash = await saveFrameData(frame.tiles, startLine);

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
          updateFrameGroups([{
            id: frameGroup,
            name: newGroupName,
          }]);
          setSyncLastUpdate('local', Math.floor((new Date()).getTime() / 1000));
        }
      }}
      deny={() => frameQueueCancelOne(frame.tempId)}
    >
      <div
        className="import-overlay__content"
      >
        <EditFrameStartLine
          tiles={frame.tiles}
          startLine={startLine}
          setStartLine={setStartLine}
        />
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
}

export default FrameQueue;
