import updateIfDefined from '../../../tools/updateIfDefined';

const exportCropFrameReducer = (value = false, action) => {
  switch (action.type) {
    case 'SET_EXPORT_CROP_FRAME':
      return action.payload;
    case 'GLOBAL_UPDATE':
      return updateIfDefined(action.payload.exportCropFrame, value);
    default:
      return value;
  }
};

export default exportCropFrameReducer;
