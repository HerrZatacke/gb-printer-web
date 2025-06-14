export const findSubarray = (haystack: Uint8Array, needle: Uint8Array): number => {
  const len = needle.length;
  const limit = haystack.length - len + 1;
  for (let i = 0; i < limit; i++) {
    let match = true;
    for (let j = 0; j < len; j++) {
      if (haystack[i + j] !== needle[j]) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }
  return -1;
};
