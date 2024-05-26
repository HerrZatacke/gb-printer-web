import React from 'react';
import Lightbox from '../../Lightbox';
import Input, { InputType } from '../../Input';
import ImageRender from '../../ImageRender';

import './index.scss';
import { useEditPalette } from './useEditPalette';

const EditPalette = () => {

  const {
    canConfirm,
    canEditShortName,
    newName,
    newShortName,
    palette,
    previewImages,
    shortName,
    setNewName,
    setNewShortName,
    setPalette,
    save,
    cancelEditPalette,
  } = useEditPalette();

  if (!shortName) {
    return null;
  }

  return (
    <Lightbox
      className="edit-palette"
      confirm={save}
      canConfirm={canConfirm}
      deny={() => cancelEditPalette()}
      closeOnOverlayClick={false}
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
          type={InputType.TEXT}
          value={newShortName}
          disabled={!canEditShortName}
          onChange={(value) => {
            setNewShortName((value as string).toLowerCase());
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
                  palette={palette}
                />
              </li>
            ))
          }
        </ul>
        {
          palette.map((color, index) => (
            <Input
              key={index}
              id={`palette-color-${index}`}
              labelText={`Color ${index + 1}`}
              type={InputType.COLOR}
              value={color}
              onChange={(value) => {
                const np = [...palette];
                np[index] = value as string;
                setPalette(np);
              }}
            />
          ))
        }
      </div>
    </Lightbox>
  );
};

export default EditPalette;
