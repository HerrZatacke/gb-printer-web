import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ImageRender from '../../ImageRender';
import EditImageTabs from '../../EditImageTabs';
import Lightbox from '../../Lightbox';
import modifyTagChanges from '../../../../tools/modifyTagChanges';

const willUpdate = (batch) => (
  batch ? (
    [
      batch.created ? 'date' : null,
      batch.title ? 'title' : null,
      batch.palette ? 'palette' : null,
      batch.invertPalette ? 'invertPalette' : null,
      batch.frame ? 'frame' : null,
      batch.lockFrame ? 'framePalette' : null,
      batch.tags ? 'tags' : null,
    ]
      .filter(Boolean)
      .join(', ')
  ) : ''
);

const EditForm = (props) => {
  const [title, updateTitle] = useState(props.title);
  const [created, updateCreated] = useState(props.created);
  const [frame, updateFrame] = useState(props.frame);
  const [lockFrame, updateFrameLock] = useState(props.lockFrame);
  const [invertPalette, updateInvertPalette] = useState(props.invertPalette);
  const [paletteShort, updatePaletteShort] = useState(props.paletteShort);
  const [paletteRGBN, updatePaletteRGBN] = useState(props.paletteRGBN);
  const [isRegularImage, setIsRegularImage] = useState(true);
  const [tagChanges, updateTagChanges] = useState({
    initial: props.tags,
    add: [],
    remove: [],
  });
  const [batch, updateBatch] = useState(props.batch ? {
    created: false,
    title: false,
    palette: false,
    invertPalette: false,
    frame: false,
    lockFrame: false,
    tags: false,
  } : false);

  if (!props.hash) {
    return null;
  }

  const usedPalette = paletteShort ? props.findPalette(paletteShort).palette : paletteRGBN;

  const willUpdateBatch = willUpdate(batch);

  const onUpdate = (what, fn) => (value) => {
    updateBatch({ ...batch, [what]: true });
    fn(value);
  };

  return (
    <Lightbox
      height={props.height}
      className="edit-image"
      confirm={() => props.save({
        batch: props.batch ? batch : false,
        tagChanges,
      }, {
        hash: props.hash,
        title,
        created,
        frame,
        invertPalette,
        lockFrame,
        palette: paletteShort || paletteRGBN,
      })}
      deny={props.cancel}
    >
      <label className="edit-image__header">
        <input
          className="edit-image__header-edit"
          placeholder="Add a title"
          value={title}
          onChange={({ target: { value } }) => {
            onUpdate('title', updateTitle)(value);
          }}
        />
      </label>
      {
        !props.batch ? null : (
          <span className="edit-image__title-hint">Use %n (or %nn, %nnn, ...) to add an index to the image titles</span>
        )
      }
      <ImageRender
        lockFrame={lockFrame}
        invertPalette={invertPalette}
        palette={usedPalette}
        frameId={frame}
        hash={props.hash}
        hashes={props.hashes}
        reportTileCount={(tileCount) => {
          setIsRegularImage(tileCount === 360);
        }}
      />
      { props.batch ? (
        <div
          className="edit-image__batch-warn"
          style={usedPalette ? {
            borderLeftColor: usedPalette[1],
            borderTopColor: usedPalette[1],
            backgroundColor: usedPalette[2],
            borderRightColor: usedPalette[3],
            borderBottomColor: usedPalette[3],
            color: usedPalette[0],
          } : null}
        >
          { `You are editing ${props.batch} images` }
          { willUpdateBatch ? (
            <p className="edit-image__batch-update-list">
              {`Will update: ${willUpdateBatch}`}
            </p>
          ) : null}
        </div>
      ) : null }
      <EditImageTabs
        created={created}
        updateCreated={onUpdate('created', updateCreated)}
        regularImage={isRegularImage}
        lockFrame={lockFrame}
        hashes={props.hashes}
        paletteShort={paletteShort}
        paletteRGBN={paletteRGBN}
        invertPalette={invertPalette}
        frame={frame}
        tags={tagChanges}
        meta={props.meta}
        updatePalette={(paletteUpdate, confirm) => {
          if (confirm) {
            updateBatch({ ...batch, palette: true });
          }

          if (paletteShort) {
            updatePaletteShort(paletteUpdate);
          } else {
            updatePaletteRGBN(paletteUpdate);
          }
        }}
        updateInvertPalette={onUpdate('invertPalette', updateInvertPalette)}
        updateFrame={onUpdate('frame', updateFrame)}
        updateFrameLock={onUpdate('lockFrame', updateFrameLock)}
        updateTags={(mode, tag) => {
          updateBatch({ ...batch, tags: true });
          updateTagChanges({
            ...tagChanges,
            ...modifyTagChanges(tagChanges, { mode, tag }),
          });
        }}
      />
    </Lightbox>
  );
};

EditForm.propTypes = {
  batch: PropTypes.number.isRequired,
  created: PropTypes.string,
  cancel: PropTypes.func.isRequired,
  hash: PropTypes.string,
  hashes: PropTypes.object,
  paletteShort: PropTypes.string,
  paletteRGBN: PropTypes.object,
  invertPalette: PropTypes.bool.isRequired,
  lockFrame: PropTypes.bool.isRequired,
  frame: PropTypes.string,
  save: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  title: PropTypes.string,
  height: PropTypes.number.isRequired,
  findPalette: PropTypes.func.isRequired,
  meta: PropTypes.object,
};

EditForm.defaultProps = {
  created: null,
  title: null,
  hash: null,
  hashes: null,
  paletteShort: null,
  paletteRGBN: null,
  frame: null,
  meta: null,
};

export default EditForm;
