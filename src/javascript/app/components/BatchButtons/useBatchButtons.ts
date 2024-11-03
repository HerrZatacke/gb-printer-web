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

  const indexOffset = page * pageSize;
  const images: Image[] = getFilteredImages(
    state.images,
    { sortBy, filtersActiveTags, recentImports },
  ).splice(indexOffset, pageSize || Infinity);
  const selectedImages = images.filter(({ hash }) => imageSelection.includes(hash));
  const monochromeImages: MonochromeImage[] = selectedImages.reduce(reduceImagesMonochrome, []);

  return ({
    hasPlugins: !!state.plugins.length,
    batchEnabled: selectedImages.length > 1,
    monochromeBatchEnabled: selectedImages.length > 1 && monochromeImages.length === selectedImages.length,
    activeFilters: filtersActiveTags.length || 0,
    selectedImages: imageSelection.length,
    hasSelected: selectedImages.length > 0,
    batchTask: (action: BatchActionType) => {
      dispatch<BatchTaskAction>({
        type: Actions.BATCH_TASK,
        payload: action,
        page,
      });
    },
    checkAll: () => {
      setImageSelection(
        getFilteredImages(state.images, {
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
