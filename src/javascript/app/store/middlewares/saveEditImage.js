const saveEditImage = (store) => (next) => (action) => {

  if (action.type === 'SAVE_EDIT_IMAGE') {
    const state = store.getState();

    store.dispatch({
      type: 'UPDATE_IMAGE',
      payload: state.editImage,
    });
    return;
  }

  next(action);
};


export default saveEditImage;
