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
    idExists,
    formValid,
    groupIdValid,
    frameIndexValid,
  } = useEditFrame();

  const updateHead = updateId !== fullId ? ` -> "${fullId}"` : '';

  const groupExists = Boolean(groups.find(({ id }) => (frameGroup === id)));

  return (
    <Lightbox
      className="edit-frame"
      confirm={saveFrame}
      canConfirm={!formValid}
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
              {groupExists ? 'Select frame group' : 'New frame group'}
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
          labelText={groupExists ? 'Frame group id' : 'New frame group id'}
          type="text"
          value={frameGroup}
          onChange={setFrameGroup}
        >
          {groupIdValid ? null : (
            <span className="inputgroup__note inputgroup__note--warn">
              Must have at least two characters, only lowercase
            </span>
          )}
        </Input>
        <Input
          id="frame-edit-index"
          labelText="Frame Index"
          type="number"
          min={1}
          max={99}
          value={frameIndex}
          onChange={setFrameIndex}
        >
          {frameIndexValid ? null : (
            <span className="inputgroup__note inputgroup__note--warn">
              Integer, must be greater 0
            </span>
          )}
        </Input>
        <Input
          id="frame-edit-shortname"
          labelText="Frame name"
          type="text"
          value={frameName}
          onChange={setFrameName}
        />
        <p className="edit-frame__warning">
          { !idExists ? '\u00A0' : 'This frame id already exists!' }
        </p>
      </div>
    </Lightbox>
  );
};

export default EditFrame;
