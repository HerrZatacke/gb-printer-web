import { SortDirection } from '@/workers/itemsIndexedDbWorker/schemas';

const sortBy = <T>(key: keyof T, direction: SortDirection = SortDirection.ASC) => (arr: T[]): T[] => {

  const dir = direction === SortDirection.DESC ? -1 : 1;

  return (
    [...arr].sort((a, b) => {
      if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        return (a[key] as string).localeCompare(b[key]) * dir;
      }

      if (a[key] > b[key]) {
        return dir;
      }

      if (a[key] < b[key]) {
        return -dir;
      }

      return 0;
    })
  );
};

export default sortBy;
