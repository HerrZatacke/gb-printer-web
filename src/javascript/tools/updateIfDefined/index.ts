const updateIfDefined = <T>(update?: T, oldval?: T): T | undefined => (
  (typeof update !== 'undefined') ? update : oldval
);

export default updateIfDefined;
