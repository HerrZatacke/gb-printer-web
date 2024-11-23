import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import useDialogsStore from '../../stores/dialogsStore';
import useEditStore from '../../stores/editStore';
import useFiltersStore from '../../stores/filtersStore';
import useInteractionsStore from '../../stores/interactionsStore';
import useItemsStore from '../../stores/itemsStore';
import useSettingsStore from '../../stores/settingsStore';
import { getFilteredImages } from '../../../tools/getFilteredImages';
import { Actions } from '../../store/actions';
import { BatchActionType } from '../../../consts/batchActionTypes';
import { reduceImagesMonochrome } from '../../../tools/isRGBNImage';
import { useGalleryTreeContext } from '../../contexts/galleryTree';
import unique from '../../../tools/unique';
import type { Image, MonochromeImage } from '../../../../types/Image';
import type { State } from '../../store/State';
import type { DeleteImagesAction, DownloadImageSelectionAction } from '../../../../types/actions/ImageActions';

interface UseBatchButtons {
  hasPlugins: boolean,
  batchEnabled: boolean,
  monochromeBatchEnabled: boolean,
  activeFilters: number,
  selectedImages: number,
  hasSelected: boolean,
  batchTask: (action: BatchActionType) => void,
  checkAll: () => void,
  unCheckAll: () => void,
  filter: () => void,
  showSortOptions: () => void,
}

const collectTags = (batchImages: Image[]): string[] => (
  unique(batchImages.map(({ tags }) => tags).flat())
);

const useBatchButtons = (page: number): UseBatchButtons => {
  const {
    imageSelection,
    sortBy,
    filtersActiveTags,
    recentImports,
    setFiltersVisible,
    setSortOptionsVisible,
    setImageSelection,
  } = useFiltersStore();
  const { plugins } = useItemsStore();
  const { pageSize } = useSettingsStore();
  const dispatch = useDispatch();

  const { setEditImages, setEditRGBNImages } = useEditStore.getState();
  const { dismissDialog, setDialog } = useDialogsStore.getState();
  const { setVideoSelection } = useInteractionsStore.getState();

  const stateImages = useSelector((state: State) => state.images);

  const { view, covers } = useGalleryTreeContext();

  const indexOffset = page * pageSize;
  const images: Image[] = getFilteredImages(view.images, { sortBy, filtersActiveTags, recentImports }) // take images from current VIEW (including covers)
    .splice(indexOffset, pageSize || Infinity) // use images of the current PAGE
    .filter((image: Image) => !covers.includes(image.hash)); // And remove covers AFTERWARDS
  const selectedImages = images.filter(({ hash }) => imageSelection.includes(hash));
  const monochromeImages: MonochromeImage[] = selectedImages.reduce(reduceImagesMonochrome, []);

  const batchImages: Image[] = useMemo(() => (
    imageSelection.reduce((acc: Image[], selHash: string): Image[] => {
      const image = stateImages.find(({ hash }) => hash === selHash);
      return image ? [image, ...acc] : acc;
    }, [])
  ), [imageSelection, stateImages]);

  return ({
    hasPlugins: !!plugins.length,
    batchEnabled: !!imageSelection.length,
    monochromeBatchEnabled: selectedImages.length > 1 && monochromeImages.length === selectedImages.length,
    activeFilters: filtersActiveTags.length || 0,
    selectedImages: imageSelection.length,
    hasSelected: selectedImages.length > 0,
    batchTask: (actionType: BatchActionType) => {
      if (imageSelection.length) {
        switch (actionType) {
          case BatchActionType.DELETE: {
            setDialog({
              message: `Delete ${imageSelection.length} images?`,
              confirm: async () => {
                dispatch<DeleteImagesAction>({
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
            dispatch<DownloadImageSelectionAction>({
              type: Actions.DOWNLOAD_SELECTION,
              payload: imageSelection,
            });
            break;
          }

          case BatchActionType.EDIT: {
            setEditImages({
              tags: collectTags(batchImages),
              batch: batchImages.map(({ hash }) => hash),
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
    },
    checkAll: () => {
      setImageSelection(
        getFilteredImages(view.images, {
          filtersActiveTags,
          sortBy,
          recentImports,
        })
          .slice(page * pageSize, (page + 1) * pageSize || undefined)
          .map(({ hash }) => hash),
      );
    },
    unCheckAll: () => setImageSelection([]),
    filter: () => setFiltersVisible(true),
    showSortOptions: () => setSortOptionsVisible(true),
  });
};

export default useBatchButtons;
