import type { ExportFrameMode } from 'gb-image-decoder';
import type { Actions } from '../../javascript/app/store/actions';
import type { Frame } from '../Frame';
import type { FrameGroup } from '../FrameGroup';

export interface AddFrameAction {
  type: Actions.ADD_FRAME,
  payload?: {
    tempId: string,
    frame: Frame
  },
}

export interface UpdateFrameAction {
  type: Actions.UPDATE_FRAME,
  payload: {
    updateId: string,
    data: Frame,
  }
}

export interface DeleteFrameAction {
  type: Actions.DELETE_FRAME,
  payload: string,
}

export interface EditFrameAction {
  type: Actions.EDIT_FRAME,
  payload: string,
}

export interface CancelEditFrameAction {
  type: Actions.CANCEL_EDIT_FRAME,
}

export interface FrameGroupNamesAction {
  type: Actions.NAME_FRAMEGROUP,
  payload: FrameGroup,
}

export interface SavFrameTypesAction {
  type: Actions.SET_SAV_FRAME_TYPES,
  payload: string,
}

export interface HandleExportFrameAction {
  type: Actions.SET_HANDLE_EXPORT_FRAME,
  payload: ExportFrameMode,
}
