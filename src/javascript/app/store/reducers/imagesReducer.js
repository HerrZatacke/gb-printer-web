const unique = (images) => (
  images.filter((image, index) => (
    images.findIndex(({ hash }) => hash === image.hash) === index
  ))
);

const imagesReducer = (value = [], action) => {
  switch (action.type) {
    case 'ADD_IMAGE':
      return unique([...value, action.payload]);
    case 'DELETE_IMAGE':
      return value.filter(({ hash }) => hash !== action.payload);
    case 'UPDATE_IMAGE':
      return value.map((image) => (
        image.hash === action.payload.hash ? action.payload : image
      ));
    default:
      return value;
  }
};

export default imagesReducer;
