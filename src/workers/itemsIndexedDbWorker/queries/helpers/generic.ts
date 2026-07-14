import { ItemsSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const intersectAll = (
  sets: Set<string>[],
): Set<string> => {
  return sets.reduce((acc, s) => new Set([...acc].filter((id) => s.has(id))));
};

export const getAddPaging = <T>(
  total: number,
  page: number,
  pageSize: number,
) => (
  sortedItems: T[],
): ItemsSourceResponse<T> => {
  const start = page * pageSize;

  return {
    items: sortedItems.slice(start, start + pageSize),
    paging: {
      filtered: sortedItems.length,
      total,
      pageSize,
      page,
    },
  };
};
