import updateIfDefined from '../../../tools/updateIfDefined';

const rgbnImagesReducer = (value = null, action) => {
  switch (action.type) {
    case 'UPDATE_RGBN_PART':
      return { ...value, ...action.payload };
    case 'ADD_IMAGES':
      return action.payload[0]?.hashes ? null : value;
    case 'DELETE_IMAGE':
    case 'DELETE_IMAGES':
      return null;
    case 'GLOBAL_UPDATE':
      return updateIfDefined(action.payload.rgbnImages, value);
    default:
      return value;
  }
};

export default rgbnImagesReducer;
