import React from 'react';
import classNames from 'classnames';
import Lightbox from '../../Lightbox';
import useEditImageGroup, { NEW_GROUP } from './useEditImageGroup';
import Input, { InputType } from '../../Input';

import './index.scss';
import Select from '../Confirm/fields/Select';

function EditImageGroup() {
  const {
    editId,
    absoluteSlug,
    possibleParents,
    slug,
    title,
    canConfirm,
    slugIsInUse,
    parentSlug,
    setSlug,
    setTitle,
    setParentSlug,
    confirm,
    cancelEditImageGroup,
  } = useEditImageGroup();

  return (
    <Lightbox
      className="edit-image-group"
      confirm={confirm}
      canConfirm={canConfirm}
      header={editId !== NEW_GROUP ? `Editing group ${title ? `"${title}"` : ''}` : 'Create new image group'}
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
                    `Path "${absoluteSlug}" is already in use` :
                    `Full Path: "${absoluteSlug}"`
                }
              </p>
            </Input>
            { editId === NEW_GROUP ? null : (
              <Select
                id="paths"
                label="Parent group"
                options={possibleParents}
                setSelected={setParentSlug}
                value={parentSlug}
                disabled={false}
              />
            ) }
          </>
        ) : (
          <p>{ `A group with the ID '${editId}' does not exist!` }</p>
        ) }
      </div>
    </Lightbox>
  );
}

export default EditImageGroup;
