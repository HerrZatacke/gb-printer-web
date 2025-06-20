const uniqueBy = <T>(key: keyof T) => (arr: T[]): T[] => {
  const seen = new Set<T[typeof key]>();
  return arr.filter((item) => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

export default uniqueBy;
