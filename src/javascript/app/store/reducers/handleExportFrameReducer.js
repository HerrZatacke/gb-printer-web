import updateIfDefined from '../../../tools/updateIfDefined';

const handleExportFrameReducer = (value = false, action) => {
  switch (action.type) {
    case 'SET_HANDLE_EXPORT_FRAME':
      return action.payload;
    case 'GLOBAL_UPDATE':
      return updateIfDefined(action.payload.handleExportFrame, value);
    default:
      return value;
  }
};

export default handleExportFrameReducer;
