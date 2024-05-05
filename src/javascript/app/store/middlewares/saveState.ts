import { definitions } from '../defaults';
import { State } from '../State';
import { MiddlewareWithState } from '../../../../types/BasicMiddleware';

const saveState: MiddlewareWithState = (store) => (next) => (action) => {
  next(action);

  const state = store.getState();
  const savedState: Partial<State> = {};

  definitions
    .forEach(({ key, saveLocally }) => {
      if (!saveLocally) {
        return;
      }

      switch (key) {
        case 'palettes':
          Object.assign(savedState, { [key]: state.palettes.filter(({ isPredefined }) => !isPredefined) });
          break;
        default:
          Object.assign(savedState, { [key]: state[key] });
          break;
      }
    });

  localStorage.setItem('gbp-web-state', JSON.stringify(savedState));
};

export default saveState;
