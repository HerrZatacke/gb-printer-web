import { Actions } from '../actions';

export type GlobalUpdateAction = {
  type: Actions.GLOBAL_UPDATE,
  payload: {
    activePalette?: string,
    newSelectedPalette?: string,
    enableDebug?: boolean,
    exportFileTypes?: string[],
    exportScaleFactors?: number[],
    forceMagicCheck?: boolean,
  }
}
