const markUpdatedBatch = (batch, payload) => {
  if (!batch) {
    return undefined;
  }

  const changedProp = Object.keys(payload)[0];

  if (!payload.confirmed) {
    return { ...batch };
  }

  return {
    ...batch,
    [changedProp]: true,
  };
};

const editImageReducer = (value = {}, action) => {
  switch (action.type) {
    case 'SET_EDIT_IMAGE':
      return action.payload;
    case 'UPDATE_EDIT_IMAGE':
      return {
        ...value,
        ...action.payload,
        batch: markUpdatedBatch(value.batch, action.payload),
      };
    case 'CANCEL_EDIT_IMAGE':
    case 'UPDATE_IMAGE':
    case 'UPDATE_IMAGES_BATCH':
    case 'CLOSE_OVERLAY':
      return {};
    default:
      return value;
  }
};

export default editImageReducer;
