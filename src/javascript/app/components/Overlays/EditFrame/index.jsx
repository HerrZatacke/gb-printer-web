import React from 'react';
import { useSelector } from 'react-redux';
import Lightbox from '../../Lightbox';
import './index.scss';
import useEditFrame from './useEditFrame';
import EditFrameForm from './EditFrameForm';

// eslint-disable-next-line
const EditFrame = () => {
  const frame = useSelector((state) => state.frames.find(({ id }) => id === state.editFrame));

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
    <Lightbox
      className="edit-frame"
      confirm={saveFrame}
      canConfirm={formValid}
      header={`Editing frame "${updateId}"${updateHead}`}
      deny={cancelEdit}
      denyOnOverlayClick={false}
    >
      <div
        className="edit-frame__content"
      >
        <EditFrameForm
          frameIndex={frameIndex}
          setFrameIndex={setFrameIndex}
          frameName={frameName}
          setFrameGroup={setFrameGroup}
          setFrameName={setFrameName}
          idValid={idValid}
          groupIdValid={groupIdValid}
          frameIndexValid={frameIndexValid}
          frameGroup={frameGroup}
          groups={groups}
          fullId={fullId}
        />
      </div>
    </Lightbox>
  );
};

export default EditFrame;
