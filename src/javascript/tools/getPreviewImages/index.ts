import type { FilteredImagesState } from '../getFilteredImages';
import { getFilteredImages } from '../getFilteredImages';
import { addSortIndex, removeSortIndex, sortImages } from '../sortImages';
import uniqueBy from '../unique/by';
import type { Image, MonochromeImage } from '../../../types/Image';
import { reduceImagesMonochrome } from '../isRGBNImage';

const uniqeHash = uniqueBy<Image>('hash');

const getPreviewImages = (
  images: Image[],
  filterState: FilteredImagesState,
  imageSelection: string[],
) => (): MonochromeImage[] => {
  const selectedImages = imageSelection
    .map((imageHash) => (
      images.find(({ hash }) => hash === imageHash)
    ))
    .reduce(reduceImagesMonochrome, []);

  const filtered = (selectedImages.length > 1) ?
    [] :
    getFilteredImages(images, filterState).reduce(reduceImagesMonochrome, []);

  const allImages = ((selectedImages.length + filtered.length) > 1) ?
    [] :
    [...images]
      .map(addSortIndex)
      .sort(sortImages(filterState.sortBy))
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
