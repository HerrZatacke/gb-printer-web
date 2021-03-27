import uniqueBy from '../../../tools/unique/by';

const imagesReducer = (value = [], action) => {
  switch (action.type) {
    case 'ADD_IMAGES':
      return uniqueBy('hash')([...value, ...action.payload]);
    case 'DELETE_IMAGE':
      return [...value.filter(({ hash }) => hash !== action.payload)];
    case 'DELETE_IMAGES':
      return [...value.filter(({ hash }) => !action.payload.includes(hash))];
    case 'UPDATE_IMAGE':
      return value.map((image) => (
        (image.hash === action.payload.hash) ? {
          ...image,
          ...action.payload,
        } : image
      ));
    case 'UPDATE_IMAGES_BATCH':
      return value.map((image) => (
        // return changed image if existent in payload
        action.payload.find((changedImage) => (changedImage.hash === image.hash)) || image
      ));
    case 'GLOBAL_UPDATE':
      return uniqueBy('hash')(action.payload.images);
    default:
      return value;
  }
};

export default imagesReducer;
