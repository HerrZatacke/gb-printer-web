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

      switch (key) {
        case 'palettes':
          savedState[key] = state.palettes.filter(({ isPredefined }) => !isPredefined);
          break;
        default:
          savedState[key] = state[key];
          break;
      }
    });

  localStorage.setItem('gbp-web-state', JSON.stringify(savedState));
};

export default saveState;
