import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ImageRender from '../../ImageRender';
import EditImageTabs from '../../EditImageTabs';
import Lightbox from '../../Lightbox';
import modifyTagChanges from '../../../../tools/modifyTagChanges';

const willUpdate = (batch) => ([
  batch.created ? 'date' : null,
  batch.title ? 'title' : null,
  batch.palette ? 'palette' : null,
  batch.invertPalette ? 'invertPalette' : null,
  batch.frame ? 'frame' : null,
  batch.lockFrame ? 'framePalette' : null,
  batch.tags ? 'tags' : null,
  batch.rotation ? 'rotation' : null,
]
  .filter(Boolean)
  .join(', ')
);

const EditForm = (props) => {
  const [title, updateTitle] = useState(props.title);
  const [created, updateCreated] = useState(props.created);
  const [frame, updateFrame] = useState(props.frame);
  const [lockFrame, updateFrameLock] = useState(props.lockFrame);
  const [rotation, updateRotation] = useState(props.rotation);
  const [invertPalette, updateInvertPalette] = useState(props.invertPalette);
  const [paletteShort, updatePaletteShort] = useState(props.paletteShort);
  const [paletteRGBN, updatePaletteRGBN] = useState(props.paletteRGBN);
  const [isRegularImage, setIsRegularImage] = useState(false);
  const [tagChanges, updateTagChanges] = useState({
    initial: props.tags,
    add: [],
    remove: [],
  });
  const [shouldUpdate, updateShouldUpdate] = useState({
    created: false,
    title: false,
    palette: false,
    invertPalette: false,
    frame: false,
    lockFrame: false,
    tags: false,
    rotation: false,
  });

  const {
    tileCounter,
    hash,
  } = props;

  useEffect(() => {
    const updateIsRegular = async () => {
      if (!hash) {
        return;
      }

      const tileCount = await tileCounter(hash);
      setIsRegularImage(tileCount === 360);
    };

    updateIsRegular();
  }, [tileCounter, hash]);

  if (!hash) {
    return null;
  }

  const usedPalette = paletteShort ? props.findPalette(paletteShort).palette : paletteRGBN;

  const willUpdateBatch = willUpdate(shouldUpdate);

  const onUpdate = (what, fn) => (value) => {
    updateShouldUpdate({ ...shouldUpdate, [what]: true });
    fn(value);
  };

  return (
    <Lightbox
      height={props.height}
      className="edit-image"
      confirm={() => props.save(
        shouldUpdate,
        {
          title,
          created,
          frame,
          invertPalette,
          lockFrame,
          palette: paletteShort || paletteRGBN,
          rotation,
        },
        tagChanges,
      )}
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
        !props.imageCount ? null : (
          <span className="edit-image__title-hint">Use %n (or %nn, %nnn, ...) to add an index to the image titles</span>
        )
      }
      <ImageRender
        lockFrame={lockFrame}
        invertPalette={invertPalette}
        palette={usedPalette}
        frameId={frame}
        hash={hash}
        hashes={props.hashes}
        rotation={rotation}
      />
      { props.imageCount > 1 ? (
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
          { `You are editing ${props.imageCount} images` }
          <p className="edit-image__batch-update-list">
            {`Will update: ${willUpdateBatch}`}
          </p>
        </div>
      ) : null }
      <EditImageTabs
        created={created}
        updateCreated={onUpdate('created', updateCreated)}
        regularImage={isRegularImage}
        mixedTypes={props.mixedTypes}
        lockFrame={lockFrame}
        hash={hash}
        hashes={props.hashes}
        paletteShort={paletteShort}
        paletteRGBN={paletteRGBN}
        invertPalette={invertPalette}
        frame={frame}
        tags={tagChanges}
        meta={props.meta}
        rotation={rotation}
        updatePalette={(paletteUpdate, confirm) => {
          if (confirm) {
            updateShouldUpdate({ ...shouldUpdate, palette: true });
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
        updateRotation={onUpdate('rotation', updateRotation)}
        updateTags={(mode, tag) => {
          updateShouldUpdate({ ...shouldUpdate, tags: true });
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
  imageCount: PropTypes.number.isRequired,
  created: PropTypes.string,
  cancel: PropTypes.func.isRequired,
  tileCounter: PropTypes.func.isRequired,
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
  rotation: PropTypes.number,
  mixedTypes: PropTypes.bool,
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
  rotation: null,
  mixedTypes: null,
};

export default EditForm;
