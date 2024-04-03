/* eslint-disable default-param-last */
import { Actions } from '../actions';
import unique from '../../../tools/unique';
import updateIfDefined from '../../../tools/updateIfDefined';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';

interface ExportFileTypesAction {
  type: Actions.UPDATE_EXPORT_FILE_TYPES,
  payload: {
    checked: boolean,
    fileType: string,
  }
}

const exportFileTypesReducer = (value = ['png'], action: ExportFileTypesAction | GlobalUpdateAction): string[] => {
  switch (action.type) {
    case Actions.UPDATE_EXPORT_FILE_TYPES:
      if (action.payload.checked) {
        return unique([...value, action.payload.fileType]);
      }

      return value.filter((fileType) => (
        fileType !== action.payload.fileType
      ));
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.exportFileTypes, value);
    default:
      return value;
  }
};

export default exportFileTypesReducer;
