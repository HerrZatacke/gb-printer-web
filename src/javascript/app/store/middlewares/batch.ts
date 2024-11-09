import unique from '../../../tools/unique';
import { Actions } from '../actions';
import useDialogsStore from '../../stores/dialogsStore';
import useEditStore from '../../stores/editStore';
import useFiltersStore from '../../stores/filtersStore';
import useInteractionsStore from '../../stores/interactionsStore';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type { Image } from '../../../../types/Image';
import type { DeleteImagesAction, DownloadImageSelectionAction, EditImageSelectionAction } from '../../../../types/actions/ImageActions';
import { BatchActionType } from '../../../consts/batchActionTypes';
import { reduceImagesMonochrome } from '../../../tools/isRGBNImage';


const collectTags = (batchImages: Image[]): string[] => (
  unique(batchImages.map(({ tags }) => tags).flat())
);

const batch: MiddlewareWithState = (store) => (next) => (action) => {
  const { setEditRGBNImages } = useEditStore.getState();
  const { dismissDialog, setDialog } = useDialogsStore.getState();
  const { imageSelection } = useFiltersStore.getState();
  const { setVideoSelection } = useInteractionsStore.getState();

  if (action.type === Actions.BATCH_TASK) {
    const { images } = store.getState();

    const batchImages = imageSelection.reduce((acc: Image[], selHash: string): Image[] => {
      const image = images.find(({ hash }) => hash === selHash);
      return image ? [image, ...acc] : acc;
    }, []);

    if (imageSelection.length) {
      switch (action.payload as BatchActionType) {
        case BatchActionType.DELETE: {
          setDialog({
            message: `Delete ${imageSelection.length} images?`,
            confirm: async () => {
              store.dispatch<DeleteImagesAction>({
                type: Actions.DELETE_IMAGES,
                payload: imageSelection,
              });
            },
            deny: async () => dismissDialog(0),
          });

          break;
        }

        case BatchActionType.ANIMATE: {
          setVideoSelection(imageSelection);
          break;
        }

        case BatchActionType.DOWNLOAD: {
          store.dispatch<DownloadImageSelectionAction>({
            type: Actions.DOWNLOAD_SELECTION,
            payload: imageSelection,
          });
          break;
        }

        case BatchActionType.EDIT: {
          store.dispatch<EditImageSelectionAction>({
            type: Actions.EDIT_IMAGE_SELECTION,
            payload: {
              tags: collectTags(batchImages),
              batch: batchImages.map(({ hash }) => hash),
            },
          });
          break;
        }

        case BatchActionType.RGB:
          setEditRGBNImages(batchImages.reduce(reduceImagesMonochrome, []).map(({ hash }) => hash));
          break;

        default:
          break;
      }
    }

    return;
  }

  next(action);
};

export default batch;
