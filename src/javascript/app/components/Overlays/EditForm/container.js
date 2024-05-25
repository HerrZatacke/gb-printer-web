import { connect } from 'react-redux';
import { missingGreyPalette } from '../../../defaults';
import { Actions } from '../../../store/actions';
import { isRGBNImage } from '../../../../tools/isRGBNImage';
import { getImageTileCount } from '../../../../tools/loadImageTiles';

const mapStateToProps = (state) => {

  const tileCounter = getImageTileCount(state);

  const height = (state.windowDimensions.width <= 600) ?
    state.windowDimensions.height :
    Math.min(900, state.windowDimensions.height);

  const findPalette = (shortName) => (
    state.palettes.find((palette) => shortName === palette.shortName) || missingGreyPalette
  );

  if (!state.editImage?.batch?.length) {
    return {
      tileCounter,
      hash: null,
      invertPalette: false,
      lockFrame: false,
      tags: [],
      imageCount: 0,
      height,
      findPalette,
    };
  }

  const typeCount = state.editImage.batch.reduce((acc, selHash) => {
    const image = state.images.find(({ hash }) => hash === selHash);
    const isRGB = isRGBNImage(image);
    return {
      mono: acc.mono || !isRGB,
      rgb: acc.rgb || isRGB,
    };
  }, { mono: false, rgb: false });

  const mixedTypes = typeCount.mono && typeCount.rgb;

  const { batch, tags } = state.editImage;
  const image = state.images.find(({ hash }) => hash === batch[0]);

  return ({
    tileCounter,
    created: image.created || null,
    hash: image.hash,
    tags,
    title: image.title,
    hashes: image.hashes,
    frame: image.frame,
    lockFrame: image.lockFrame || false,
    meta: image.meta || null,
    palette: image.palette,
    invertPalette: image.invertPalette || false,
    imageCount: batch?.length || 0,
    rotation: image.rotation || null,
    mixedTypes,
    // frames,

    paletteShort: typeof image.palette === 'string' ? image.palette : null,
    paletteRGBN: typeof image.palette !== 'string' ? image.palette : null,

    height,
    findPalette,
  });
};

const mapDispatchToProps = (dispatch) => ({
  save: (shouldUpdate, updates, tagChanges) => {
    dispatch({
      type: Actions.UPDATE_IMAGES_BATCH_CHANGES,
      payload: {
        shouldUpdate,
        updates,
        tagChanges,
      },
    });
  },
  cancel: () => {
    dispatch({
      type: Actions.CANCEL_EDIT_IMAGES,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
