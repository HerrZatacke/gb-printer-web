import { connect } from 'react-redux';
import applyTagChanges from '../../../tools/applyTagChanges';

const mapStateToProps = (state) => {

  const height = (state.windowDimensions.width <= 600) ?
    state.windowDimensions.height :
    Math.min(800, state.windowDimensions.height);

  const findPalette = (shortName) => (
    state.palettes.find((palette) => shortName === palette.shortName)
  );

  const image = state.images.find(({ hash }) => hash === state.editImage.hash);
  const { batch, tags: batchTags } = state.editImage;

  if (!state.editImage || !image) {
    return {
      hash: null,
      invertPalette: false,
      lockFrame: false,
      tags: [],
      batch: 0,
      height,
      findPalette,
    };
  }

  return ({
    created: image.created || null,
    hash: image.hash,
    tags: batch ? batchTags : image.tags,
    title: image.title,
    hashes: image.hashes,
    frame: image.frame,
    lockFrame: image.lockFrame || false,
    palette: image.palette,
    invertPalette: image.invertPalette || false,
    batch: batch ? batch.length : 0,
    // frames,

    paletteShort: typeof image.palette === 'string' ? image.palette : null,
    paletteRGBN: typeof image.palette !== 'string' ? image.palette : null,

    height,
    findPalette,
  });
};

const mapDispatchToProps = (dispatch) => ({
  save: ({ batch, tagChanges }, image) => {
    if (batch) {
      dispatch({
        type: 'UPDATE_IMAGES_BATCH',
        payload: {
          image,
          batch,
          tagChanges,
        },
      });
    } else {
      dispatch({
        type: 'UPDATE_IMAGE',
        payload: {
          ...image,
          tags: applyTagChanges(tagChanges),
        },
      });
    }
  },
  cancel: () => {
    dispatch({
      type: 'CANCEL_EDIT_IMAGE',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
