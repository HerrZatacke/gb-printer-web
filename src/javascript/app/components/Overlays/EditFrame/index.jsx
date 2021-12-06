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
    frameId,
    setFrameId,
    frameName,
    setFrameName,
  } = useEditFrame();

  return (
    <Lightbox
      className="edit-frame"
      confirm={saveFrame}
      canConfirm
      header={`Editing frame "${updateId}"`}
      deny={cancelEdit}
      denyOnOverlayClick={false}
    >
      <div
        className="edit-frame__content"
      >
        <Input
          id="frame-edit-shortname"
          labelText="Frame ID/Index"
          type="text"
          value={frameId}
          onChange={setFrameId}
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
