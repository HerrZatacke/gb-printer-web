import React from 'react';
import PropTypes from 'prop-types';
import Input from '../../Input';

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
}) {
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
      { setFrameGroupName ? (
        <Input
          id="frame-edit-new-group-name"
          labelText="New frame group name"
          disabled={groupExists}
          type="text"
          value={groupExists ? '' : frameGroupName}
          onChange={setFrameGroupName}
        />
      ) : null }
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
        { idValid ? '\u00A0' : `Specified frame index/identifier "${fullId}" is already in use, please try another one.` }
      </p>
    </>
  );
}

EditFrameForm.propTypes = {
  frameIndex: PropTypes.number.isRequired,
  setFrameIndex: PropTypes.func.isRequired,
  frameName: PropTypes.string.isRequired,
  setFrameGroup: PropTypes.func.isRequired,
  setFrameName: PropTypes.func.isRequired,
  idValid: PropTypes.bool.isRequired,
  groupIdValid: PropTypes.bool.isRequired,
  frameIndexValid: PropTypes.bool.isRequired,
  frameGroup: PropTypes.string.isRequired,
  groups: PropTypes.array.isRequired,
  fullId: PropTypes.string.isRequired,
  frameGroupName: PropTypes.string,
  setFrameGroupName: PropTypes.func,
};

EditFrameForm.defaultProps = {
  frameGroupName: '',
  setFrameGroupName: null,
};

export default EditFrameForm;

