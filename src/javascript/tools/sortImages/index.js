const addSortIndex = (image, sortIndex) => ({
  ...image,
  sortIndex,
});

const removeSortIndex = (image) => ({
  ...image,
  sortIndex: undefined,
});

const sortImages = ({ sortBy }) => (a, b) => {

  if (!sortBy) {
    return 0;
  }

  const [sortByKey, sortByDirection] = sortBy.split('_');

  const sortA = a[sortByKey];
  const sortB = b[sortByKey];
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
