import type { FilteredImagesState } from '../getFilteredImages';
import getFilteredImages from '../getFilteredImages';
import { addSortIndex, removeSortIndex, sortImages } from '../sortImages';
import uniqueBy from '../unique/by';
import type { State } from '../../app/store/State';
import type { Image, MonochromeImage } from '../../../types/Image';
import { reduceImagesMonochrome } from '../isRGBNImage';

const uniqeHash = uniqueBy<Image>('hash');

const getPreviewImages = (state: State | FilteredImagesState) => (): MonochromeImage[] => {

  const selectedImages = state.imageSelection
    .map((imageHash) => (
      state.images.find(({ hash }) => hash === imageHash)
    ))
    .reduce(reduceImagesMonochrome, []);

  const filtered = (selectedImages.length > 1) ?
    [] :
    getFilteredImages(state, state.images).reduce(reduceImagesMonochrome, []);

  const allImages = ((selectedImages.length + filtered.length) > 1) ?
    [] :
    [...state.images]
      .map(addSortIndex)
      .sort(sortImages({ sortBy: state.sortBy }))
      .map(removeSortIndex)
      .reduce(reduceImagesMonochrome, []);

  const previewImages = uniqeHash([
    selectedImages.shift(),
    filtered.shift(),
    allImages.shift(),
    allImages.pop(),
    filtered.pop(),
    selectedImages.pop(),
  ].reduce(reduceImagesMonochrome, []));

  return [
    previewImages.shift(),
    previewImages.pop(),
  ].reduce(reduceImagesMonochrome, []);
};

export default getPreviewImages;
