import { useDispatch, useSelector } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';
import { Actions } from '../../store/actions';
import type { State } from '../../store/State';
import type { BatchTaskAction } from '../../../../types/actions/ImageActions';
import type { BatchActionType } from '../../../consts/batchActionTypes';
import type { ShowFiltersAction } from '../../../../types/actions/TagsActions';
import type { SortOptionsSetAction } from '../../../../types/actions/SortOptionsActions';
import type { Image, MonochromeImage } from '../../../../types/Image';
import { reduceImagesMonochrome } from '../../../tools/isRGBNImage';
import { useGalleryTreeContext } from '../../contexts/galleryTree';

interface UseBatchButtons {
  hasPlugins: boolean,
  batchEnabled: boolean,
  monochromeBatchEnabled: boolean,
  activeFilters: number,
  selectedImages: number,
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
  const images: Image[] = getFilteredImages(state, view.images) // take images from current VIEW (including covers)
    .splice(indexOffset, state.pageSize || Infinity) // use images of the current PAGE
    .filter((image: Image) => !covers.includes(image.hash)); // And remove covers AFTERWARDS
  const selectedImages = images.filter(({ hash }) => state.imageSelection.includes(hash));
  const monochromeImages: MonochromeImage[] = selectedImages.reduce(reduceImagesMonochrome, []);

  return ({
    hasPlugins: !!state.plugins.length,
    batchEnabled: selectedImages.length > 1,
    monochromeBatchEnabled: selectedImages.length > 1 && monochromeImages.length === selectedImages.length,
    activeFilters: state.filtersActiveTags.length || 0,
    selectedImages: state.imageSelection.length,
    hasSelected: selectedImages.length > 0,
    batchTask: (actionType: BatchActionType) => {
      dispatch<BatchTaskAction>({
        type: Actions.BATCH_TASK,
        payload: {
          actionType,
          images,
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
