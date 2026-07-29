import { type ZodType } from 'zod';
import { type ItemsSourceResponse, type ItemsSourceTotalResponse } from '@/workers/itemsIndexedDbWorker/types';

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
      maxPageIndex: Math.max(0, Math.ceil(sortedItems.length / pageSize) - 1),
    },
    duration: performance.now() - startTime,
  };
};

export const getAddTotal = <T>(
  total: number,
  startTime: number,
  schema: ZodType<T>,
) => (
  sortedItems: T[],
): ItemsSourceTotalResponse<T> => {
  const parsedItems = sortedItems.map((item) => schema.parse(item));

  return {
    items: parsedItems,
    total,
    duration: performance.now() - startTime,
  };
};
