import { Actions } from '../javascript/app/store/actions';
import { FrameGroup } from './FrameGroup';
import { Frame } from './Frame';

export type GlobalUpdateAction = {
  type: Actions.GLOBAL_UPDATE,
  payload: {
    activePalette?: string,
    newSelectedPalette?: string,
    enableDebug?: boolean,
    exportFileTypes?: string[],
    exportScaleFactors?: number[],
    forceMagicCheck?: boolean,
    frameGroupNames?: FrameGroup[],
    frames?: Frame[],
  }
}
