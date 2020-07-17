const exportCropFrameReducer = (value = false, action) => {
  switch (action.type) {
    case 'SET_EXPORT_CROP_FRAME':
      return action.payload;
    case 'GLOBAL_UPDATE':
      return action.payload.exportCropFrame || value;
    default:
      return value;
  }
};

export default exportCropFrameReducer;
