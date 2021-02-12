import { definitions } from '../defaults';

const saveState = (store) => (next) => (action) => {
  next(action);

  const state = store.getState();
  const savedState = {};

  definitions
    .forEach(({ key, saveLocally }) => {
      if (!saveLocally) {
        return;
      }

      savedState[key] = state[key];
    });

  /* ok */localStorage.setItem('gbp-web-state', JSON.stringify(savedState));
};

export default saveState;
