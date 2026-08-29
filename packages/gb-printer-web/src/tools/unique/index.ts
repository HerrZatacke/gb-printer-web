const unique = <T = string>(arr: T[]): T[] => Array.from(new Set(arr));

export default unique;
