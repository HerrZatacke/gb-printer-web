import getFilteredImages from '../../../tools/getFilteredImages';
import applyTagChanges from '../../../tools/applyTagChanges';
import sortImages from '../../../tools/sortImages';

const UPDATATABLES = ['lockFrame', 'frame', 'palette', 'invertPalette', 'title', 'tags', 'created'];

const collectTags = (batchImages) => {
  const allTags = batchImages.map(({ tags }) => tags).flat();
  return {
    initial: allTags
      .filter((tag, index) => (
        allTags.findIndex((findTag) => findTag === tag) === index
      )),
    add: [],
    remove: [],
  };
};

const batch = (store) => (next) => (action) => {

  if (action.type === 'IMAGE_SELECTION_SHIFTCLICK') {
    const state = store.getState();
    const images = getFilteredImages(state);
    const { lastSelectedImage, pageSize } = state;
    const selectedIndex = images.findIndex(({ hash }) => hash === action.payload);
    let prevSelectedIndex = images.findIndex(({ hash }) => hash === lastSelectedImage);
    if (prevSelectedIndex === -1) {
      prevSelectedIndex = action.page * pageSize;
    }

    const from = Math.min(prevSelectedIndex, selectedIndex);
    const to = Math.max(prevSelectedIndex, selectedIndex);

    store.dispatch({
      type: 'IMAGE_SELECTION_SET',
      payload: images.slice(from, to + 1).map(({ hash }) => hash),
    });
  }

  if (action.type === 'UPDATE_IMAGE') {
    const state = store.getState();
    const sortFunc = sortImages(state);
    const { editImage, images } = state;
    if (editImage.batch && editImage.batch.selection && editImage.batch.selection.length) {

      const updatedImages = editImage.batch.selection.map((selcetionHash) => (
        images.find(({ hash }) => hash === selcetionHash)
      ))
        .sort(sortFunc)
        .map((updateImage, selectionIndex) => {

          if (!updateImage) {
            return false;
          }

          const updates = {};
          let tags = updateImage.tags;

          UPDATATABLES.forEach((updatable) => {
            switch (updatable) {
              case 'title':
                if (!editImage.batch.title) {
                  break;
                }

                updates.title = editImage.title.replace(/%n/gi, selectionIndex + 1);
                break;

              case 'created':
                if (!editImage.batch.created) {
                  break;
                }

                updates.created = editImage.created;
                break;

              case 'palette':
                if (!editImage.batch.palette) {
                  break;
                }

                // prevent palette from updating if types are incompatible
                if (typeof updateImage.palette === typeof editImage.palette) {
                  updates.palette = editImage.palette;
                }

                break;

              case 'invertPalette':
                if (!editImage.batch.invertPalette) {
                  break;
                }

                updates.invertPalette = editImage.invertPalette;
                break;

              case 'frame':
                if (!editImage.batch.frame) {
                  break;
                }

                updates.frame = editImage.frame;
                break;

              case 'lockFrame':
                if (!editImage.batch.lockFrame) {
                  break;
                }

                updates.lockFrame = editImage.lockFrame;
                break;

              case 'tags':
                tags = applyTagChanges({
                  ...editImage.tags,
                  initial: updateImage.tags,
                });
                break;
              default:
                break;
            }
          });

          return {
            ...updateImage,
            ...updates,
            tags,
          };
        })
        .filter(Boolean);

      store.dispatch({
        type: 'UPDATE_IMAGES_BATCH',
        payload: updatedImages,
      });

      // Do not propagate update
      return;
    }
  }

  if (action.type === 'BATCH_TASK') {
    const state = store.getState();
    const { images, imageSelection, pageSize } = state;
    const batchImages = images.filter(({ hash }) => imageSelection.includes(hash));

    if (imageSelection.length) {
      switch (action.payload) {
        case 'delete':
          store.dispatch({
            type: 'DELETE_IMAGES',
            payload: imageSelection,
          });
          break;
        case 'animate':
          store.dispatch({
            type: 'SET_VIDEO_PARAMS',
            payload: {
              imageSelection,
            },
          });
          break;
        case 'download':
          store.dispatch({
            type: 'DOWNLOAD_SELECTION',
            payload: imageSelection,
          });
          break;
        case 'edit':
          store.dispatch({
            type: 'SET_EDIT_IMAGE',
            payload: {
              ...batchImages[0],
              batch: {
                selection: imageSelection,
                title: false,
                created: false,
                palette: false,
                invertPalette: false,
                frame: false,
                lockFrame: false,
              },
              tags: collectTags(batchImages),
            },
          });
          break;
        default:
          break;
      }
    }

    switch (action.payload) {
      case 'checkall':
        store.dispatch({
          type: 'IMAGE_SELECTION_SET',
          payload: getFilteredImages(state, true)
            .slice(action.page * pageSize, (action.page + 1) * pageSize)
            .map(({ hash }) => hash),
        });
        break;

      case 'uncheckall':
        store.dispatch({
          type: 'IMAGE_SELECTION_SET',
          payload: [],
        });
        break;

      default:
        break;
    }

    return;
  }

  next(action);
};

export default batch;
