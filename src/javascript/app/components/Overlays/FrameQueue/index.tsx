import React, { useState } from 'react';
import Lightbox from '../../Lightbox';
import './index.scss';
import EditFrameForm from '../EditFrame/EditFrameForm';
import useEditFrame from '../EditFrame/useEditFrame';
import { saveFrameData } from '../../../../tools/applyFrame/frameData';
import EditFrameStartLine from '../EditFrameStartLine';
import useDialogsStore from '../../../stores/dialogsStore';
import useImportsStore from '../../../stores/importsStore';
import useItemsStore from '../../../stores/itemsStore';
import { useStores } from '../../../../hooks/useStores';

function FrameQueue() {
  const { dismissDialog } = useDialogsStore();
  const { frameQueue, frameQueueCancelOne, importQueueCancelOne } = useImportsStore();
  const { updateLastSyncLocalNow } = useStores();
  const { addFrames, updateFrameGroups } = useItemsStore();

  const frame = frameQueue[0];
  const [newGroupName, setNewGroupName] = useState('');
  const [startLine, setStartLine] = useState<number>(Math.floor((frame.tiles.length - 280) / 40));

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
        dismissDialog(0);

        if (frame.tempId) {
          importQueueCancelOne(frame.tempId);
          frameQueueCancelOne(frame.tempId);
        }

        addFrames([{
          id: fullId,
          name: frameName,
          hash,
        }]);

        if (newGroupName?.trim()) {
          updateFrameGroups([{
            id: frameGroup,
            name: newGroupName,
          }]);
        }

        updateLastSyncLocalNow();
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
