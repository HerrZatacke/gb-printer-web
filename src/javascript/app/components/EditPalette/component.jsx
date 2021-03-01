import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../Lightbox';
import { NEW_PALETTE_SHORT } from '../../../consts/specialTags';

const EditPalette = ({
  palette,
  shortName,
  name,
  shortNameIsValid,
  savePalette,
  cancelEditPalette,
}) => {

  if (!shortName) {
    return null;
  }

  const canEditShortName = shortName === NEW_PALETTE_SHORT;

  const [newName, setNewName] = useState(name);
  const [newPalette, setNewPalette] = useState(palette);
  const [newShortName, setNewShortName] = useState(canEditShortName ? '' : shortName);

  return (
    <Lightbox
      className="edit-palette"
      confirm={() => savePalette({
        shortName: canEditShortName ? newShortName : shortName,
        name: newName,
        palette: newPalette,
        origin: '',
      })}
      canConfirm={!canEditShortName || shortNameIsValid(newShortName)}
      deny={() => cancelEditPalette()}
      denyOnOverlayClick={false}
    >
      <label className="edit-palette__header">
        <input
          className="edit-palette__header-edit"
          placeholder="Add a title"
          value={newName}
          onChange={(ev) => {
            setNewName(ev.target.value);
          }}
        />
      </label>
      <div
        className="edit-palette__content"
      >
        <div className="inputgroup">
          <label
            htmlFor="palette-edit-shortname"
            className="inputgroup__label"
          >
            ID/Short name
          </label>
          <input
            type="text"
            id="palette-edit-shortname"
            className="inputgroup__input"
            value={newShortName}
            disabled={!canEditShortName}
            onChange={({ target: { value } }) => {
              setNewShortName(value.toLowerCase());
            }}
          />
        </div>
        {
          newPalette.map((color, index) => (
            <div
              key={index}
              className="inputgroup"
            >
              <label
                htmlFor={`palette-color-${index}`}
                className="inputgroup__label"
              >
                {`Color ${index + 1}`}
              </label>
              <input
                type="color"
                id={`palette-color-${index}`}
                className="inputgroup__input inputgroup__input--color"
                value={color}
                onChange={({ target: { value } }) => {
                  const np = [...newPalette];
                  np[index] = value;
                  setNewPalette(np);
                }}
              />
            </div>
          ))
        }
      </div>
    </Lightbox>
  );
};

EditPalette.propTypes = {
  shortName: PropTypes.string,
  shortNameIsValid: PropTypes.func.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  savePalette: PropTypes.func.isRequired,
  cancelEditPalette: PropTypes.func.isRequired,
};

EditPalette.defaultProps = {
  shortName: null,
};

export default EditPalette;
