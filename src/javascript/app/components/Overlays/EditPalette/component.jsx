import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../../Lightbox';
import { NEW_PALETTE_SHORT } from '../../../../consts/SpecialTags';
import Input from '../../Input';
import ImageRender from '../../ImageRender';

const EditPalette = ({
  palette,
  shortName,
  name,
  shortNameIsValid,
  savePalette,
  cancelEditPalette,
  getPreviewImages,
}) => {

  const canEditShortName = shortName === NEW_PALETTE_SHORT;

  const [newName, setNewName] = useState(name);
  const [newPalette, setNewPalette] = useState(palette);
  const [newShortName, setNewShortName] = useState(canEditShortName ? '' : shortName);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    setPreviewImages(getPreviewImages());
  }, [getPreviewImages]);

  if (!shortName) {
    return null;
  }

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
        <Input
          id="palette-edit-shortname"
          labelText="ID/Short name"
          type="text"
          value={newShortName}
          disabled={!canEditShortName}
          onChange={(value) => {
            setNewShortName(value.toLowerCase());
          }}
        />
        <ul className="edit-palette__previews">
          {
            previewImages.map((image) => (
              <li
                className="edit-palette__preview-image"
                key={image.hash}
              >
                <ImageRender
                  hash={image.hash}
                  invertPalette={false}
                  lockFrame={false}
                  palette={newPalette}
                />
              </li>
            ))
          }
        </ul>
        {
          newPalette.map((color, index) => (
            <Input
              key={index}
              id={`palette-color-${index}`}
              labelText={`Color ${index + 1}`}
              type="color"
              value={color}
              onChange={(value) => {
                const np = [...newPalette];
                np[index] = value;
                setNewPalette(np);
              }}
            />
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
  getPreviewImages: PropTypes.func.isRequired,
};

EditPalette.defaultProps = {
  shortName: null,
};

export default EditPalette;
