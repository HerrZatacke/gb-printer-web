import applyTagChanges from '../../../tools/applyTagChanges';

const dispatchSetEditImage = (dispatch, images, imageHash) => {
  const editImage = images.find(({ hash }) => hash === imageHash);

  dispatch({
    type: 'SET_EDIT_IMAGE',
    payload: {
      ...editImage,
      tags: {
        initial: editImage.tags,
        add: editImage.tags,
        remove: [],
      },
    },
  });
};

const dispatchSaveEditImage = (dispatch, state) => {
  dispatch({
    type: 'UPDATE_IMAGE',
    payload: {
      ...state.editImage,
      tags: applyTagChanges(state.editImage.tags),
    },
  });
};

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

  window.addEventListener('resize', () => {
    store.dispatch({
      type: 'WINDOW_DIMENSIONS',
      payload: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
    });
  });

  return (next) => (action) => {

    switch (action.type) {
      case 'SAVE_EDIT_IMAGE':
        dispatchSaveEditImage(store.dispatch, store.getState());
        return;

      case 'EDIT_IMAGE':
        dispatchSetEditImage(store.dispatch, store.getState().images, action.payload);
        return;
      default:
    }

    next(action);
  };
};


export default saveEditImage;
