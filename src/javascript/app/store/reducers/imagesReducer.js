const unique = (images) => (
  images.filter((image, index) => (
    images.findIndex(({ hash }) => hash === image.hash) === index
  ))
);

const imagesReducer = (value = [], action) => {
  switch (action.type) {
    case 'ADD_IMAGE':
      return unique([...value, action.payload]);
    default:
      return value;
  }
};

export default imagesReducer;
