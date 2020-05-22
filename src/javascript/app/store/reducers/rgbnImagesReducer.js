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
    default:
      return value;
  }
};

export default rgbnImagesReducer;
