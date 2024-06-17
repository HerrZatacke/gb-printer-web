import React from 'react';
import Input, { InputType } from '../../Input';
import type { FrameGroup } from '../../../../../types/FrameGroup';

interface Props {
  frameIndex: number,
  frameName: string,
  idValid: boolean,
  groupIdValid: boolean,
  frameIndexValid: boolean,
  frameGroup: string,
  groups: FrameGroup[],
  fullId: string,
  frameGroupName?: string,
  setFrameGroupName?: (frameGroupName: string) => void,
  setFrameIndex: (frameIndex: number) => void,
  setFrameGroup: (frameGroup: string) => void,
  setFrameName: (frameName: string) => void,
}

function EditFrameForm({
  frameIndex,
  setFrameIndex,
  frameName,
  setFrameGroup,
  setFrameName,
  idValid,
  groupIdValid,
  frameIndexValid,
  frameGroup,
  groups,
  fullId,
  frameGroupName,
  setFrameGroupName,
}: Props) {
  const groupExists = Boolean(groups.find(({ id }) => (frameGroup === id)));

  return (
    <>
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
        type={InputType.TEXT}
        value={frameGroup}
        onChange={setFrameGroup}
      >
        {groupIdValid ? null : (
          <span className="inputgroup__note inputgroup__note--warn">
            Must have at least two characters, only lowercase
          </span>
        )}
      </Input>
      { setFrameGroupName ? (
        <Input
          id="frame-edit-new-group-name"
          labelText="New frame group name"
          disabled={groupExists}
          type={InputType.TEXT}
          value={groupExists ? '' : frameGroupName}
          onChange={setFrameGroupName}
        />
      ) : null }
      <Input
        id="frame-edit-index"
        labelText="Frame Index"
        type={InputType.NUMBER}
        min={1}
        max={99}
        value={frameIndex}
        onChange={(value) => setFrameIndex(parseInt(value, 10))}
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
        type={InputType.TEXT}
        value={frameName}
        onChange={setFrameName}
      />
      <p className="edit-frame__warning">
        { idValid ? '\u00A0' : `Specified frame index/identifier "${fullId}" is already in use, please try another one.` }
      </p>
    </>
  );
}

export default EditFrameForm;

