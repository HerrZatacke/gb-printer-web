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
      return [...value.filter(({ hash }) => hash !== action.payload)];
    case 'DELETE_IMAGES':
      return [...value.filter(({ hash }) => !action.payload.includes(hash))];
    case 'UPDATE_IMAGE':
      return value.map((image) => (
        image.hash === action.payload.hash ? action.payload : image
      ));
    case 'UPDATE_IMAGES_BATCH':
      return value.map((image) => (
        // return changed image if existent in payload
        action.payload.find((changedImage) => (changedImage.hash === image.hash)) || image
      ));
    default:
      return value;
  }
};

export default imagesReducer;
