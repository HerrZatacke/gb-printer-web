const rgbnImagesReducer = (value = {
  r: '',
  g: '',
  b: '',
  n: '',
}, action) => {
  switch (action.type) {
    case 'UPDATE_RGBN_PART':
      return { ...value, ...action.payload };
    default:
      return value;
  }
};

export default rgbnImagesReducer;
