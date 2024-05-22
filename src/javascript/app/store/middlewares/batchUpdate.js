import applyTagChanges from '../../../tools/applyTagChanges';
import { addSortIndex, removeSortIndex, sortImages } from '../../../tools/sortImages';
import { Actions } from '../actions';

const UPDATATABLES = ['lockFrame', 'frame', 'palette', 'invertPalette', 'title', 'tags', 'created', 'rotation'];

const batch = (store) => (next) => (action) => {

  if (action.type === Actions.UPDATE_IMAGES_BATCH) {
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
              case 'rotation':
                if (!updatedFields.rotation) {
                  break;
                }

                updates.rotation = editedUpdates.rotation;
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

  next(action);
};

export default batch;
