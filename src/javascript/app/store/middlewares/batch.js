import getFilteredImages from '../../../tools/getFilteredImages';
import applyTagChanges from '../../../tools/applyTagChanges';
import { addSortIndex, removeSortIndex, sortImages } from '../../../tools/sortImages';
import unique from '../../../tools/unique';

const UPDATATABLES = ['lockFrame', 'frame', 'palette', 'invertPalette', 'title', 'tags', 'created'];

const collectTags = (batchImages) => (
  unique(batchImages.map(({ tags }) => tags).flat())
);

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

  if (action.type === 'UPDATE_IMAGES_BATCH') {
    const state = store.getState();
    const sortFunc = sortImages(state);
    const { editImage, images } = state;
    const {
      image: editedUpdates,
      batch: updatedFields,
      tagChanges,
    } = action.payload;

    if (updatedFields && editImage.batch && editImage.batch.length) {

      const updatedImages = editImage.batch.map((selcetionHash) => (
        images.find(({ hash }) => hash === selcetionHash)
      ))
        .map(addSortIndex)
        .sort(sortFunc)
        .map(removeSortIndex)
        .map((updateImage, selectionIndex) => {

          if (!updateImage) {
            return false;
          }

          const updates = {};
          let tags = updateImage.tags;

          UPDATATABLES.forEach((updatable) => {
            switch (updatable) {
              case 'title':
                if (!updatedFields.title) {
                  break;
                }

                updates.title = editedUpdates.title.replace(/%(n+)/gi, (_, group) => (
                  (selectionIndex + 1)
                    .toString(10)
                    .padStart(group.length, '0')
                ));
                break;

              case 'created':
                if (!updatedFields.created) {
                  break;
                }

                updates.created = editedUpdates.created;
                break;

              case 'palette':
                if (!updatedFields.palette) {
                  break;
                }

                // prevent palette from updating if types are incompatible
                if (typeof updateImage.palette === typeof editedUpdates.palette) {
                  updates.palette = editedUpdates.palette;
                }

                break;

              case 'invertPalette':
                if (!updatedFields.invertPalette) {
                  break;
                }

                updates.invertPalette = editedUpdates.invertPalette;
                break;

              case 'frame':
                if (!updatedFields.frame) {
                  break;
                }

                updates.frame = editedUpdates.frame;
                break;

              case 'lockFrame':
                if (!updatedFields.lockFrame) {
                  break;
                }

                updates.lockFrame = editedUpdates.lockFrame;
                break;

              case 'tags':
                tags = applyTagChanges({
                  ...tagChanges,
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

      Object.assign(action, { payload: updatedImages });
    }
  }

  if (action.type === 'BATCH_TASK') {
    const state = store.getState();
    const { images, imageSelection, pageSize } = state;
    const batchImages = images.filter(({ hash }) => imageSelection.includes(hash));

    if (imageSelection.length) {
      switch (action.payload) {
        case 'delete': {
          store.dispatch({
            type: 'CONFIRM_ASK',
            payload: {
              message: `Delete ${imageSelection.length} images?`,
              confirm: () => {
                store.dispatch({
                  type: 'DELETE_IMAGES',
                  payload: imageSelection,
                });
              },
              deny: () => {
                store.dispatch({
                  type: 'CONFIRM_ANSWERED',
                });
              },
            },
          });

          break;
        }

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
            type: 'EDIT_IMAGE_SELECTION',
            payload: {
              hash: batchImages[0].hash,
              tags: collectTags(batchImages),
              batch: batchImages.map(({ hash }) => hash),
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
          payload: getFilteredImages(state)
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
