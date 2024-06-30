import React from 'react';
import classNames from 'classnames';
import Lightbox from '../../Lightbox';
import useEditImageGroup, { NEW_GROUP } from './useEditImageGroup';
import Input, { InputType } from '../../Input';

import './index.scss';

function EditImageGroup() {

  const {
    editId,
    absoluteSlug,
    slug,
    title,
    canConfirm,
    setSlug,
    setTitle,
    confirm,
    cancelEdit,
  } = useEditImageGroup();

  return (
    <Lightbox
      className="edit-image-group"
      confirm={confirm}
      canConfirm={canConfirm}
      header={editId !== NEW_GROUP ? `Editing group ${title ? `"${title}"` : ''}` : 'Create new image group'}
      deny={cancelEdit}
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
                {`Full Path: "${absoluteSlug}"`}
              </p>
            </Input>
          </>
        ) : (
          <p>{ `A group with the ID '${editId}' does not exist!` }</p>
        ) }
      </div>
    </Lightbox>
  );
}

export default EditImageGroup;
