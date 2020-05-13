const exportScaleFactorsReducer = (value = [1], action) => {
  switch (action.type) {
    case 'UPDATE_EXPORT_SCALE_FACTORS':
      if (action.payload.checked) {
        // return [...value, action.payload.factor];
        return [action.payload.factor];
      }

      return value.filter((factor) => (
        factor !== action.payload.factor
      ));
    default:
      return value;
  }
};

export default exportScaleFactorsReducer;
