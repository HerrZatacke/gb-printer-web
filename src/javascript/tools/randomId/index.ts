export const randomId = (): string => (
  Math.random().toString(16).split('.')[1]
);
