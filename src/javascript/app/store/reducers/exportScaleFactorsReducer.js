import updateIfDefined from '../../../tools/updateIfDefined';
import { GLOBAL_UPDATE, UPDATE_EXPORT_SCALE_FACTORS } from '../actions';

const exportScaleFactorsReducer = (value = [1], action) => {
  switch (action.type) {
    case UPDATE_EXPORT_SCALE_FACTORS:
      if (action.payload.checked) {
        if (window.navigator.msSaveBlob) {
          return [action.payload.factor];
        }

        return [...value, action.payload.factor];
      }

      return value.filter((factor) => (
        factor !== action.payload.factor
      ));
    case GLOBAL_UPDATE:
      return updateIfDefined(action.payload.exportScaleFactors, value);
    default:
      return value;
  }
};

export default exportScaleFactorsReducer;
