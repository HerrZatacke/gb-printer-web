import { useTranslations } from 'next-intl';
import React from 'react';
import Lightbox from '@/components/Lightbox';
import EditFrameForm from '@/components/Overlays/EditFrameForm';
import useEditFrame from '@/hooks/useEditFrame';
import { frameIdFromGroupAndIndex } from '@/hooks/useEditFrameForm';
import { useFrames } from '@/hooks/useFrames';
import { useEditStore } from '@/stores/stores';

const EditFrame = () => {
  const t = useTranslations('EditFrame');
  const { editFrame } = useEditStore();
  const { frames } = useFrames({ list: true });
  const frame = frames.find((f) => f.id === editFrame) || null;

  const {
    editFrameData,
    onEditDataChange,
    onFormValidChange,
    formValid,
    cancelEdit,
    saveFrame,
  } = useEditFrame(frame);

  const newId = editFrameData ? frameIdFromGroupAndIndex(editFrameData.frameGroup, editFrameData.frameIndex) : '';
  const idChange = (newId && newId !== editFrameData?.initialId) ? t('idChange', { newId }) : '';

  return (
    <Lightbox
      confirm={saveFrame}
      canConfirm={formValid}
      header={editFrameData ? t('dialogHeader', { id: editFrameData.initialId, idChange }) : undefined}
      deny={cancelEdit}
    >
      {editFrameData && (
        <EditFrameForm
          editFrameData={editFrameData}
          onEditDataChange={onEditDataChange}
          onFormValidChange={onFormValidChange}
        />
      )}
    </Lightbox>
  );
};

export default EditFrame;
