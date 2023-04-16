import getFilteredImages from '../getFilteredImages';
import { addSortIndex, removeSortIndex, sortImages } from '../sortImages';
import uniqueBy from '../unique/by';

const filterRGB = (palette) => (
  palette && !palette.hashes
);

const uniqeHash = uniqueBy('hash');

const getPreviewImages = (state) => () => {

  const selectedImages = state.imageSelection
    .map((imageHash) => (
      state.images.find(({ hash }) => hash === imageHash)
    ))
    .filter(filterRGB);

  const filtered = (selectedImages.length > 1) ?
    [] :
    getFilteredImages(state).filter(filterRGB);

  const allImages = ((selectedImages.length + filtered.length) > 1) ?
    [] :
    [...state.images]
      .map(addSortIndex)
      .sort(sortImages({ sortBy: state.sortBy }))
      .map(removeSortIndex)
      .filter(filterRGB);

  const previewImages = uniqeHash(
    [
      selectedImages.shift(),
      filtered.shift(),
      allImages.shift(),
      allImages.pop(),
      filtered.pop(),
      selectedImages.pop(),
    ]
      .filter(Boolean),
  );

  return [
    previewImages.shift(),
    previewImages.pop(),
  ]
    .filter(Boolean);
};

export default getPreviewImages;
