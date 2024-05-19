import getFilteredImages from '../getFilteredImages';
import { addSortIndex, removeSortIndex, sortImages } from '../sortImages';
import uniqueBy from '../unique/by';
import { State } from '../../app/store/State';
import { Image, MonochromeImage } from '../../../types/Image';
import { isRGBNImage } from '../isRGBNImage';

const filterRGB = (acc: MonochromeImage[], image?: Image): MonochromeImage[] => (
  (!image || isRGBNImage(image)) ? acc : [...acc, (image as MonochromeImage)]
);

const uniqeHash = uniqueBy<Image>('hash');

const getPreviewImages = (state: State) => (): MonochromeImage[] => {

  const selectedImages = state.imageSelection
    .map((imageHash) => (
      state.images.find(({ hash }) => hash === imageHash)
    ))
    .reduce(filterRGB, []);

  const filtered = (selectedImages.length > 1) ?
    [] :
    getFilteredImages(state).reduce(filterRGB, []);

  const allImages = ((selectedImages.length + filtered.length) > 1) ?
    [] :
    [...state.images]
      .map(addSortIndex)
      .sort(sortImages({ sortBy: state.sortBy }))
      .map(removeSortIndex)
      .reduce(filterRGB, []);

  const previewImages = uniqeHash([
    selectedImages.shift(),
    filtered.shift(),
    allImages.shift(),
    allImages.pop(),
    filtered.pop(),
    selectedImages.pop(),
  ].reduce(filterRGB, []));

  return [
    previewImages.shift(),
    previewImages.pop(),
  ].reduce(filterRGB, []);
};

export default getPreviewImages;
