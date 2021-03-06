import unique from '../../../tools/unique';
import updateIfDefined from '../../../tools/updateIfDefined';

const exportFileTypesReducer = (value = ['png'], action) => {
  switch (action.type) {
    case 'UPDATE_EXPORT_FILE_TYPES':
      if (action.payload.checked) {
        return unique([...value, action.payload.fileType]);
      }

      return value.filter((fileType) => (
        fileType !== action.payload.fileType
      ));
    case 'GLOBAL_UPDATE':
      return updateIfDefined(action.payload.exportFileTypes, value);
    default:
      return value;
  }
};

export default exportFileTypesReducer;
