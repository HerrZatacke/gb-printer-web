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

  const groupExists = Boolean(groups.find(({ id }) => (frameGroup === id)));

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
        <div className="inputgroup">
          <label htmlFor="frame-edit-group" className="inputgroup__label">
            Frame group
          </label>
          <select
            id="frame-edit-group"
            className="inputgroup__input inputgroup__input--select"
            value={frameGroup}
            onChange={(ev) => {
              setFrameGroup(ev.target.value);
            }}
          >
            <option value="">
              {groupExists ? 'Select Frameset' : 'New Frameset'}
            </option>
            {
              groups.map(({ id, name }) => (
                <option value={id} key={id}>{ name }</option>
              ))
            }
          </select>
        </div>
        <Input
          id="frame-edit-new-group"
          labelText="New group"
          type="text"
          value={groupExists ? '' : frameGroup}
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
