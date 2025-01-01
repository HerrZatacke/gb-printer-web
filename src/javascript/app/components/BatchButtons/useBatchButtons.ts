import { useDispatch, useSelector } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';
import { Actions } from '../../store/actions';
import type { State } from '../../store/State';
import type { BatchTaskAction } from '../../../../types/actions/ImageActions';
import type { BatchActionType } from '../../../consts/batchActionTypes';
import type { ShowFiltersAction } from '../../../../types/actions/TagsActions';
import type { SortOptionsSetAction } from '../../../../types/actions/SortOptionsActions';
import type { Image } from '../../../../types/Image';
import { reduceImagesMonochrome } from '../../../tools/isRGBNImage';
import { useGalleryTreeContext } from '../../contexts/galleryTree';

interface UseBatchButtons {
  hasPlugins: boolean,
  batchEnabled: boolean,
  monochromeBatchEnabled: boolean,
  activeFilters: number,
  selectedImageCount: number,
  hasSelected: boolean,
  batchTask: (action: BatchActionType) => void,
  filter: () => void,
  showSortOptions: () => void,
}

const useBatchButtons = (page: number): UseBatchButtons => {
  const state = useSelector((currentState: State) => currentState);
  const dispatch = useDispatch();

  const { view, covers } = useGalleryTreeContext();

  const indexOffset = page * state.pageSize;
  const currentPageImages: Image[] = getFilteredImages(state, view.images) // take images from current VIEW (including covers)
    .splice(indexOffset, state.pageSize || Infinity) // use images of the current PAGE
    .filter((image: Image) => !covers.includes(image.hash)); // And remove covers AFTERWARDS

  const selectedImages = state.images.filter(({ hash }) => state.imageSelection.includes(hash));
  const monochromeImageCount: number = selectedImages.reduce(reduceImagesMonochrome, []).length;

  const selectedImageCount = state.imageSelection.length;
  const hasSelected = selectedImages.length > 0;


  return ({
    hasPlugins: !!state.plugins.length,
    batchEnabled: selectedImages.length > 1,
    monochromeBatchEnabled: selectedImages.length > 1 && monochromeImageCount === selectedImages.length,
    activeFilters: state.filtersActiveTags.length || 0,
    selectedImageCount,
    hasSelected,
    batchTask: (actionType: BatchActionType) => {
      dispatch<BatchTaskAction>({
        type: Actions.BATCH_TASK,
        payload: {
          actionType,
          currentPageHashes: currentPageImages.map(({ hash }) => (hash)),
          page,
        },
      });
    },
    filter: () => {
      dispatch<ShowFiltersAction>({
        type: Actions.SHOW_FILTERS,
      });
    },
    showSortOptions: () => {
      dispatch<SortOptionsSetAction>({
        type: Actions.SHOW_SORT_OPTIONS,
      });
    },
  });
};

export default useBatchButtons;
