import { Image } from '../../../types/Image';

interface Sortable {
  sortIndex: number,
}

interface UnSortable {
  sortIndex?: number,
}

type SortableImage = Sortable & Image;
type UnSortableImage = UnSortable & Image;

const addSortIndex = (image: Image, sortIndex: number): SortableImage => ({
  ...image,
  sortIndex,
});

const removeSortIndex = (image: SortableImage): Image => ({
  ...image,
  sortIndex: undefined,
} as UnSortableImage as Image);

const sortImages = ({ sortBy }: { sortBy: string }) => (a: SortableImage, b: SortableImage) => {

  if (!sortBy) {
    return 0;
  }

  const [sortByKey, sortByDirection] = sortBy.split('_');

  const sortA = a[sortByKey as ('created' | 'title' | 'palette')];
  const sortB = b[sortByKey as ('created' | 'title' | 'palette')];
  const sortDirection = sortByDirection === 'desc' ? -1 : 1;

  if (!sortA || !sortB) {
    return 0;
  }

  if (sortA > sortB) {
    return sortDirection;
  }

  if (sortA < sortB) {
    return -sortDirection;
  }

  return a.sortIndex < b.sortIndex ? sortDirection : -sortDirection;
};


export {
  addSortIndex,
  removeSortIndex,
  sortImages,
};
