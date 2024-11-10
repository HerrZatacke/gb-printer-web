import { Actions } from '../actions';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type {
  UpdateWindowDimensionsAction,
} from '../../../../types/actions/GlobalActions';

const dimensionsMiddleware: MiddlewareWithState = (store) => {

  window.addEventListener('resize', () => {
    store.dispatch<UpdateWindowDimensionsAction>({
      type: Actions.WINDOW_DIMENSIONS,
      payload: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
    });
  });

  return (next) => (action) => {
    next(action);
  };
};


export default dimensionsMiddleware;
