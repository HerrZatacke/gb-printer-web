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
  const actualPageSize = pageSize < 1 ? sortedItems.length : pageSize;
  const start = page * actualPageSize;

  const slicedItems = sortedItems.slice(start, start + actualPageSize);
  const parsedItems = slicedItems.map((item) => schema.parse(item));

  return {
    items: parsedItems,
    paging: {
      filtered: sortedItems.length,
      total,
      pageSize: actualPageSize,
      page,
      maxPageIndex: Math.max(0, Math.ceil(sortedItems.length / actualPageSize) - 1),
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
