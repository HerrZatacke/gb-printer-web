import defaults from '../../defaults';

const saveState = (store) => (next) => (action) => {
  next(action);

  const state = store.getState();
  const savedState = {};

  Object.keys(defaults)
    .forEach((key) => {
      if (key === 'palettes') {
        return;
      }

      savedState[key] = state[key];
    });

  localStorage.setItem('gbp-web-state', JSON.stringify(savedState));
};

export default saveState;
