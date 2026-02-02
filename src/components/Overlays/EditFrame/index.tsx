import { useTranslations } from 'next-intl';
import React from 'react';
import Lightbox from '@/components/Lightbox';
import useEditFrame from '@/hooks/useEditFrame';
import { useEditStore, useItemsStore } from '@/stores/stores';
import EditFrameForm from './EditFrameForm';

const EditFrame = () => {
  const t = useTranslations('EditFrame');
  const { editFrame } = useEditStore();
  const { frames } = useItemsStore();
  const frame = frames.find(({ id }) => id === editFrame);

  const {
    cancelEdit,
    saveFrame,
    updateId,
    fullId,
    formValid,
    frameGroups,
    frameGroup,
    frameIndex,
    setFrameIndex,
    frameName,
    setFrameGroup,
    setFrameName,
    idValid,
    groupIdValid,
    frameIndexValid,
  } = useEditFrame(frame);

  const idChange = updateId !== fullId ? t('idChange', { newId: fullId }) : '';

  return (
    <Lightbox
      confirm={saveFrame}
      canConfirm={formValid}
      header={frame ? t('dialogHeader', { id: updateId, idChange }) : undefined}
      deny={cancelEdit}
    >
      { frame ? (
        <EditFrameForm
          groups={frameGroups}
          fullId={fullId}
          frameIndex={frameIndex}
          frameGroup={frameGroup}
          frameName={frameName}
          idValid={idValid}
          groupIdValid={groupIdValid}
          frameIndexValid={frameIndexValid}
          setFrameIndex={setFrameIndex}
          setFrameGroup={setFrameGroup}
          setFrameName={setFrameName}
        />
      ) : null }
    </Lightbox>
  );
};

export default EditFrame;
