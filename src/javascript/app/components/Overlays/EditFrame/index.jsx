import React from 'react';
import Lightbox from '../../Lightbox';
import Input from '../../Input';
import './index.scss';
import useEditFrame from './useEditFrame';

// eslint-disable-next-line
const EditFrame = () => {
  const {
    cancelEdit,
    saveFrame,
    updateId,
    fullId,
    frameIndex,
    groups,
    setFrameIndex,
    frameName,
    frameGroup,
    setFrameGroup,
    setFrameName,
  } = useEditFrame();

  const updateHead = updateId !== fullId ? ` -> "${fullId}"` : '';

  return (
    <Lightbox
      className="edit-frame"
      confirm={saveFrame}
      canConfirm
      header={`Editing frame "${updateId}"${updateHead}`}
      deny={cancelEdit}
      denyOnOverlayClick={false}
    >
      <div
        className="edit-frame__content"
      >
        <Input
          id="frame-edit-group"
          labelText="Frame group"
          type="text"
          value={frameGroup}
          onChange={setFrameGroup}
        />
        <Input
          id="frame-edit-index"
          labelText="Frame Index"
          type="number"
          min={1}
          max={99}
          value={frameIndex}
          onChange={setFrameIndex}
        />
        <Input
          id="frame-edit-shortname"
          labelText="Frame name"
          type="text"
          value={frameName}
          onChange={setFrameName}
        />
      </div>
    </Lightbox>
  );
};

export default EditFrame;
