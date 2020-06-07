const markUpdatedBatch = (batch, payload) => {
  if (!batch) {
    return undefined;
  }

  if (!payload.confirmed) {
    return { ...batch };
  }

  const changedProp = Object.keys(payload)[0];

  return {
    ...batch,
    [changedProp]: true,
  };
};

const editImageTags = (tags, payload) => {

  if (payload.mode && payload.tag) {
    const add = [];
    const remove = [];

    switch (payload.mode) {
      case 'add':
        add.push(...tags.add, payload.tag);
        remove.push(...tags.remove.filter((tag) => tag !== payload.tag));
        break;
      case 'remove':
        remove.push(...tags.remove, payload.tag);
        add.push(...tags.add.filter((tag) => tag !== payload.tag));
        break;
      default:
        break;
    }

    return {
      ...tags,
      add,
      remove,
    };
  }

  return { ...tags };
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
        tags: editImageTags(value.tags, action.payload),
      };
    case 'CANCEL_EDIT_IMAGE':
    case 'UPDATE_IMAGE':
    case 'UPDATE_IMAGES_BATCH':
    case 'CLOSE_OVERLAY':
      return {};
    case 'GLOBAL_UPDATE':
      return action.payload.editImage || value;
    default:
      return value;
  }
};

export default editImageReducer;
