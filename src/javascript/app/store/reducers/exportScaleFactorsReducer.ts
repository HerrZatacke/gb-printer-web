/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';

interface ExportScaleFactorsAction {
  type: Actions.UPDATE_EXPORT_SCALE_FACTORS,
  payload: {
    checked: boolean,
    factor: number,
  }
}

const exportScaleFactorsReducer = (value = [1], action: ExportScaleFactorsAction | GlobalUpdateAction): number[] => {
  switch (action.type) {
    case Actions.UPDATE_EXPORT_SCALE_FACTORS:
      if (action.payload.checked) {
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
