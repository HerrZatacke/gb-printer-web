const uniqueBy = <T>(key: string) => (arr: Record<string, T>[]): Record<string, T>[] => (
  arr.filter((item, index) => (
    arr.findIndex((find) => find[key] === item[key]) === index
  ))
);

export default uniqueBy;
