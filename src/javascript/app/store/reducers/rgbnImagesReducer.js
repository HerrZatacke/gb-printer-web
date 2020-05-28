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
    default:
      return value;
  }
};

export default rgbnImagesReducer;
