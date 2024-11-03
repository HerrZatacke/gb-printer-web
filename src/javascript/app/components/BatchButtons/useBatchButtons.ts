import { useDispatch, useSelector } from 'react-redux';
import useFiltersStore from '../../stores/filtersStore';
import useSettingsStore from '../../stores/settingsStore';
import { getFilteredImages } from '../../../tools/getFilteredImages';
import { Actions } from '../../store/actions';
import type { State } from '../../store/State';
import type { BatchTaskAction } from '../../../../types/actions/ImageActions';
import type { BatchActionType } from '../../../consts/batchActionTypes';
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
  checkAll: () => void,
  unCheckAll: () => void,
  filter: () => void,
  showSortOptions: () => void,
}

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
  const state = useSelector((currentState: State) => currentState);
  const { pageSize } = useSettingsStore();
  const dispatch = useDispatch();

  const { view, covers } = useGalleryTreeContext();

  const indexOffset = page * pageSize;
  const images: Image[] = getFilteredImages(view.images, { sortBy, filtersActiveTags, recentImports }) // take images from current VIEW (including covers)
    .splice(indexOffset, pageSize || Infinity) // use images of the current PAGE
    .filter((image: Image) => !covers.includes(image.hash)); // And remove covers AFTERWARDS
  const selectedImages = images.filter(({ hash }) => imageSelection.includes(hash));
  const monochromeImages: MonochromeImage[] = selectedImages.reduce(reduceImagesMonochrome, []);

  return ({
    hasPlugins: !!state.plugins.length,
    batchEnabled: !!imageSelection.length,
    monochromeBatchEnabled: selectedImages.length > 1 && monochromeImages.length === selectedImages.length,
    activeFilters: filtersActiveTags.length || 0,
    selectedImages: imageSelection.length,
    hasSelected: selectedImages.length > 0,
    batchTask: (actionType: BatchActionType) => {
      dispatch<BatchTaskAction>({
        type: Actions.BATCH_TASK,
        payload: actionType,
        page,
      });
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
