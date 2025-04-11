import React from 'react';
import classNames from 'classnames';
import OldLightbox from '../../Lightbox';
import useEditImageGroup, { NEW_GROUP } from './useEditImageGroup';
import Input, { InputType } from '../../Input';
import Select from '../EditRGBN/Select';
import Debug from '../../Debug';

import './index.scss';

function EditImageGroup() {
  const {
    editId,
    absoluteSlug,
    possibleParents,
    slug,
    title,
    canConfirm,
    canMove,
    slugIsInUse,
    slugWasChanged,
    parentSlug,
    selectionCount,
    setSlug,
    setTitle,
    setParentSlug,
    confirm,
    move,
    cancelEditImageGroup,
  } = useEditImageGroup();

  return (
    <OldLightbox
      className="edit-image-group"
      confirm={confirm}
      canConfirm={canConfirm}
      header={editId !== NEW_GROUP ? `Editing group ${title ? `"${title}"` : ''}` : `Create new group with ${selectionCount} images`}
      deny={cancelEditImageGroup}
    >
      <div
        className="edit-image-group__content"
      >
        { editId ? (
          <>
            <Input
              id="title"
              labelText="Title / Description"
              value={title}
              onChange={setTitle}
              type={InputType.TEXT}
            />
            <Input
              id="slug"
              labelText="Pathsegment / Identifier"
              value={slug}
              onChange={setSlug}
              type={InputType.TEXT}
            >
              <p
                className={classNames('edit-image-group__text', {
                  'edit-image-group__text--error': !canConfirm,
                })}
              >
                {
                  slugIsInUse ?
                    `Path${slugWasChanged ? ' is already in use' : ''}: "${absoluteSlug}"` :
                    `Path: "${absoluteSlug}"`
                }
              </p>
            </Input>
            { possibleParents.length > 1 && (
              <Select
                id="paths"
                label="Parent group"
                options={possibleParents}
                setSelected={setParentSlug}
                value={parentSlug}
                disabled={false}
              />
            ) }
            { possibleParents.length > 1 && editId === NEW_GROUP && (
              <button
                className="button edit-image-group__move-button"
                type="button"
                disabled={!canMove}
                onClick={move}
              >
                { `Move all ${selectionCount} image(s) without creating a group` }
              </button>
            ) }
            <Debug>
              { JSON.stringify({ slug, parentSlug, canConfirm, slugIsInUse }, null, 2) }
            </Debug>
          </>
        ) : (
          <p>{ `A group with the ID '${editId}' does not exist!` }</p>
        ) }
      </div>
    </OldLightbox>
  );
}

export default EditImageGroup;
