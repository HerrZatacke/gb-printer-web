const saveEditImage = (store) => (next) => (action) => {

  switch (action.type) {
    case 'SAVE_EDIT_IMAGE':
      store.dispatch({
        type: 'UPDATE_IMAGE',
        payload: store.getState().editImage,
      });
      return;

    case 'EDIT_IMAGE':
      store.dispatch({
        type: 'SET_EDIT_IMAGE',
        payload: store.getState().images.find(({ hash }) => hash === action.payload),
      });
      return;
    default:
  }

  next(action);
};


export default saveEditImage;
