const updateIfDefined = <T>(update: T | undefined, oldval: T): T => (
  (typeof update !== 'undefined') ? update : oldval
);

export default updateIfDefined;
