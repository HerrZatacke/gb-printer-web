import updateIfDefined from '../../../tools/updateIfDefined';

const DEFAULT = {
  r: '',
  g: '',
  b: '',
  n: '',
};

const rgbnImagesReducer = (value = DEFAULT, action) => {
  switch (action.type) {
    case 'UPDATE_RGBN_PART':
      return { ...value, ...action.payload };
    case 'ADD_IMAGE':
      return action.payload.hashes ? { ...DEFAULT } : value;
    case 'DELETE_IMAGE':
    case 'DELETE_IMAGES':
      return DEFAULT;
    case 'GLOBAL_UPDATE':
      return updateIfDefined(action.payload.rgbnImages, value);
    default:
      return value;
  }
};

export default rgbnImagesReducer;
