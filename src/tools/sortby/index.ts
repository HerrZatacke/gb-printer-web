export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

const sortBy = <T>(key: keyof T, direction = SortDirection.ASC) => (arr: T[]): T[] => {

  const dir = direction === SortDirection.DESC ? -1 : 1;

  return (
    [...arr].sort((a, b) => {
      if (typeof a[key] === 'string') {
        return (a[key] as string).localeCompare(b[key] as string);
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
