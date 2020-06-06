const saveEditImage = (store) => {

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && ev.ctrlKey && store.getState().editImage.hash) {
      const state = store.getState();

      store.dispatch({
        type: 'SAVE_EDIT_IMAGE',
      });

      if (state.editImage) {
        ev.preventDefault();
      }
    }
  });

  return (next) => (action) => {

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
          payload: store.getState()
            .images
            .find(({ hash }) => hash === action.payload),
        });
        return;
      default:
    }

    next(action);
  };
};


export default saveEditImage;
