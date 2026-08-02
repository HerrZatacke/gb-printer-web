import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import EditFrameStartLine from '@/components/EditFrameStartLine';
import Lightbox from '@/components/Lightbox';
import EditFrameForm from '@/components/Overlays/EditFrameForm';
import useEditFrame from '@/hooks/useEditFrame';
import { frameIdFromGroupAndIndex } from '@/hooks/useEditFrameForm';
import { useFrameGroups } from '@/hooks/useFrameGroups';
import { useStores } from '@/hooks/useStores';
import { useImportsStore } from '@/stores/stores';
import { compressAndHashFrame, saveFrameData } from '@/tools/applyFrame/frameData';
import { Frame } from '@/types/Frame';

function FrameQueue() {
  const t = useTranslations('FrameQueue');
  const {
    frameQueue,
    frameQueueCancelOne,
    importQueueCancelOne,
  } = useImportsStore();
  const { updateLastSyncLocalNow } = useStores();
  const { updateFrameGroups } = useFrameGroups();

  const frame = frameQueue[0];
  const [newFrameGroupName, setNewFrameGroupName] = useState('');
  const [startLine, setStartLine] = useState<number>(Math.floor((frame.tiles.length - 280) / 40));

  const [initialFrame] = useState<Frame | null>({
    id: '',
    hash: '',
    name: frame.fileName,
    lines: frame.tiles.length,
  });

  const {
    editFrameData,
    setHash,
    onEditDataChange,
    onFormValidChange,
    formValid,
    saveFrame,
  } = useEditFrame(initialFrame);

  useEffect(() => {
    if (!frame) {
      return;
    }

    compressAndHashFrame(frame.tiles, startLine)
      .then(({ dataHash }) => {
        setHash(dataHash);
      });
  }, [frame, setHash, startLine]);

  if (!editFrameData) {
    return null;
  }

  const newId = frameIdFromGroupAndIndex(editFrameData.frameGroup, editFrameData.frameIndex);

  return (
    <Lightbox
      header={t('dialogHeader', { id: newId })}
      canConfirm={formValid}
      confirm={async () => {
        await saveFrameData(frame.tiles, startLine);
        await saveFrame();

        if (frame.tempId) {
          frameQueueCancelOne(frame.tempId);
          importQueueCancelOne(frame.tempId);
        }

        if (newFrameGroupName?.trim()) {
          await updateFrameGroups([{
            id: editFrameData.frameGroup,
            name: newFrameGroupName,
          }]);
        }

        updateLastSyncLocalNow();
      }}
      deny={() => frameQueueCancelOne(frame.tempId)}
    >
      <EditFrameForm
        editFrameData={editFrameData}
        onEditDataChange={onEditDataChange}
        onFormValidChange={onFormValidChange}
        newFrameGroupName={newFrameGroupName}
        setNewFrameGroupName={setNewFrameGroupName}
        extraFields={(
          <EditFrameStartLine
            tiles={frame.tiles}
            startLine={startLine}
            setStartLine={setStartLine}
          />
        )}
      />
    </Lightbox>
  );
}

export default FrameQueue;
