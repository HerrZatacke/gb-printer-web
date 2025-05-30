
export const reduceItems = <T>(acc: T[], item?: T | null): T[] => (
  !item ? acc : [...acc, item]
);
