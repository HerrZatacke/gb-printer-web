import { type ZodType } from 'zod';
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
  startTime: number,
  schema: ZodType<T>,
) => (
  sortedItems: T[],
): ItemsSourceResponse<T> => {
  const start = page * pageSize;

  const slicedItems = sortedItems.slice(start, start + pageSize);
  const parsedItems = slicedItems.map((item) => schema.parse(item));

  return {
    items: parsedItems,
    paging: {
      filtered: sortedItems.length,
      total,
      pageSize,
      page,
    },
    duration: performance.now() - startTime,
  };
};
