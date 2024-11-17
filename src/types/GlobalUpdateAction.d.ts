import type { Actions } from '../javascript/app/store/actions';
import type { State } from '../javascript/app/store/State';
import type { Values } from '../javascript/app/stores/itemsStore';

export type GlobalUpdateAction = {
  type: Actions.GLOBAL_UPDATE,
  payload?: Partial<State & Values>,
}
