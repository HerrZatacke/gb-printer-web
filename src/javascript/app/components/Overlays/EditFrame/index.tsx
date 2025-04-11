import React from 'react';
import OldLightbox from '../../Lightbox';
import './index.scss';
import useEditFrame from './useEditFrame';
import EditFrameForm from './EditFrameForm';
import useEditStore from '../../../stores/editStore';
import useItemsStore from '../../../stores/itemsStore';

// eslint-disable-next-line
const EditFrame = () => {
  const { editFrame } = useEditStore();
  const { frames } = useItemsStore();
  const frame = frames.find(({ id }) => id === editFrame);

  const {
    cancelEdit,
    saveFrame,
    updateId,
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
  } = useEditFrame(frame);

  const updateHead = updateId !== fullId ? ` -> "${fullId}"` : '';

  return (
    <OldLightbox
      className="edit-frame"
      confirm={saveFrame}
      canConfirm={formValid}
      header={frame ? `Editing frame "${updateId}"${updateHead}` : `Error editing '${editFrame}'`}
      deny={cancelEdit}
    >
      <div
        className="edit-frame__content"
      >
        { frame ? (
          <EditFrameForm
            groups={groups}
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
        ) : (
          <p>{ `A frame with the ID '${editFrame}' does not exist!` }</p>
        ) }
      </div>
    </OldLightbox>
  );
};

export default EditFrame;
