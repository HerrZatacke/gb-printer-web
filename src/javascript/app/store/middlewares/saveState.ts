import { definitions } from '../defaults';
import type { State } from '../State';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';

const saveState: MiddlewareWithState = (store) => (next) => (action) => {
  next(action);

  const state = store.getState();
  const savedState: Partial<State> = {};

  definitions
    .forEach(({ key, saveLocally }) => {
      if (!saveLocally) {
        return;
      }

      Object.assign(savedState, { [key]: state[key] });
    });

  console.log('not updating local storage during final phase of zustand refactor');
  console.log(savedState);
  // localStorage.setItem('gbp-web-state', JSON.stringify(savedState));
};

export default saveState;
