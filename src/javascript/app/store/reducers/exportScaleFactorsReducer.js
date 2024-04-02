/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';

const exportScaleFactorsReducer = (value = [1], action) => {
  switch (action.type) {
    case Actions.UPDATE_EXPORT_SCALE_FACTORS:
      if (action.payload.checked) {
        if (window.navigator.msSaveBlob) {
          return [action.payload.factor];
        }

        return [...value, action.payload.factor];
      }

      return value.filter((factor) => (
        factor !== action.payload.factor
      ));
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.exportScaleFactors, value);
    default:
      return value;
  }
};

export default exportScaleFactorsReducer;
