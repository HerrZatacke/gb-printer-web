import uniqe from '../../../tools/unique';

const exportFileTypesReducer = (value = ['png'], action) => {
  switch (action.type) {
    case 'UPDATE_EXPORT_FILE_TYPES':
      if (action.payload.checked) {
        return uniqe([...value, action.payload.fileType]);
      }

      return value.filter((fileType) => (
        fileType !== action.payload.fileType
      ));
    case 'GLOBAL_UPDATE':
      return action.payload.exportFileTypes || value;
    default:
      return value;
  }
};

export default exportFileTypesReducer;
