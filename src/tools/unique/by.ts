const uniqueBy = <T>(key: keyof T) => (arr: T[]): T[] => (
  arr.filter((item, index) => (
    arr.findIndex((find) => find[key] === item[key]) === index
  ))
);

export default uniqueBy;
