const updateIfDefined = (update, oldval) => (
  (typeof update !== 'undefined') ? update : oldval
);

export default updateIfDefined;
