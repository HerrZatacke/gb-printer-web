import type { Actions } from '../javascript/app/store/actions';
import type { State } from '../javascript/app/store/State';

export type GlobalUpdateAction = {
  type: Actions.GLOBAL_UPDATE,
  payload?: Partial<State>,
}
