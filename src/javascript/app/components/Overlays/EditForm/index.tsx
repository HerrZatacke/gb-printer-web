/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import ImageRender from '../../ImageRender';
import EditImageTabs from '../../EditImageTabs';
import Lightbox from '../../Lightbox';

import './index.scss';
import { useEditForm } from './useEditForm';

function EditForm() {
  const {
    toEdit,
    form,
    isRegularImage,
    willUpdateBatch,
    tagChanges,
    usedPalette,
    usedFramePalette,
    updateForm,
    updatePalette,
    updateFramePalette,
    updateTags,
    save,
    cancel,
  } = useEditForm();

  if (!toEdit) {
    console.warn('Editform should be open, but "toEdit" is undefined', toEdit);
    return null;
  }

  const {
    title,
    created,
    frame,
    lockFrame,
    rotation,
    invertPalette,
    invertFramePalette,
    framePaletteShort,
    paletteShort,
    paletteRGBN,
  } = form;

  return (
    <Lightbox
      height={toEdit.height}
      className="edit-image"
      confirm={() => save()}
      deny={cancel}
    >
      <label className="edit-image__header">
        <input
          className="edit-image__header-edit"
          placeholder="Add a title"
          value={title}
          onChange={({ target: { value } }) => {
            updateForm('title')(value);
          }}
        />
      </label>
      {
        !toEdit.imageCount ? null : (
          <span className="edit-image__title-hint">Use %n (or %nn, %nnn, ...) to add an index to the image titles</span>
        )
      }
      <ImageRender
        lockFrame={lockFrame}
        invertPalette={invertPalette}
        palette={usedPalette}
        invertFramePalette={invertFramePalette}
        framePalette={usedFramePalette}
        frameId={frame}
        hash={toEdit.hash}
        hashes={toEdit.hashes}
        rotation={rotation}
      />
      { toEdit.imageCount > 1 ? (
        <div
          className="edit-image__batch-warn"
          // style={usedPalette ? {
          //   borderLeftColor: usedPalette[1],
          //   borderTopColor: usedPalette[1],
          //   backgroundColor: usedPalette[2],
          //   borderRightColor: usedPalette[3],
          //   borderBottomColor: usedPalette[3],
          //   color: usedPalette[0],
          // } : null}
        >
          <h2 className="edit-image__batch-update-title">
            { `You are editing ${toEdit.imageCount} images` }
          </h2>
          {
            willUpdateBatch.length ? (
              <>
                <p className="edit-image__batch-update-list">
                  Will update:
                </p>
                <ul className="edit-image__batch-update-list">
                  { willUpdateBatch.map((txt, index) => (
                    <li key={index}>{ txt }</li>
                  )) }
                </ul>
              </>
            ) : null
          }
        </div>
      ) : null }
      <EditImageTabs
        created={created}
        updateCreated={updateForm('created')}
        regularImage={isRegularImage}
        mixedTypes={toEdit.mixedTypes}
        lockFrame={lockFrame}
        hash={toEdit.hash}
        hashes={toEdit.hashes}
        paletteShort={paletteShort}
        framePaletteShort={framePaletteShort}
        paletteRGBN={paletteRGBN}
        invertPalette={invertPalette}
        invertFramePalette={invertFramePalette}
        frame={frame}
        tags={tagChanges}
        meta={toEdit.meta}
        rotation={rotation}
        updatePalette={updatePalette}
        updateInvertPalette={updateForm('invertPalette')}
        updateFramePalette={updateFramePalette}
        updateInvertFramePalette={updateForm('invertFramePalette')}
        updateFrame={updateForm('frame')}
        updateFrameLock={updateForm('lockFrame')}
        updateRotation={updateForm('rotation')}
        updateTags={updateTags}
      />
    </Lightbox>
  );
}

export default EditForm;
