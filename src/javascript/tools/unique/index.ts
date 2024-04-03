const unique = (arr: string[]): string[] => (
  arr.filter((item, index) => (
    arr.findIndex((findTag) => findTag === item) === index
  ))
);

export default unique;
