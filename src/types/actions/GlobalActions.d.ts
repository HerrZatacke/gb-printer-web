import type { Actions } from '../../javascript/app/store/actions';
import type { WindowDimensions } from '../WindowDimensions';
import type { ErrorMessage } from '../../javascript/app/components/Errors/useErrors';

export interface DragoverAction {
  type: Actions.IMPORT_DRAGOVER_START | Actions.IMPORT_DRAGOVER_END,
}

export interface EnableDebugAction {
  type: Actions.SET_DEBUG,
  payload: boolean,
}

export interface FramesMessageHideAction {
  type: Actions.FRAMES_MESSAGE_HIDE
}

export interface HideDatesAction {
  type: Actions.SET_HIDE_DATES,
  payload: boolean,
}

export interface ImportDeletedAction {
  type: Actions.SET_IMPORT_DELETED,
  payload: boolean,
}

export interface ImportLastSeenAction {
  type: Actions.SET_IMPORT_LAST_SEEN,
  payload: boolean,
}

export interface ImportPadAction {
  type: Actions.SET_IMPORT_PAD,
  payload: boolean,
}

export interface PageSizeAction {
  type: Actions.SET_PAGESIZE,
  payload: number,
}

export interface PreferredLocaleAction {
  type: Actions.SET_PREFERRED_LOCALE,
  payload?: string,
}

export interface ShowSerialsAction {
  type: Actions.SHOW_SERIALS,
  payload?: boolean,
}

export interface UseSerialsAction {
  type: Actions.USE_SERIALS,
  payload?: boolean,
}

export interface UpdateWindowDimensionsAction {
  type: Actions.WINDOW_DIMENSIONS,
  payload?: WindowDimensions,
}

export interface ErrorAction {
  type: Actions.ERROR,
  payload?: ErrorMessage,
}

export interface DismissErrorAction {
  type: Actions.DISMISS_ERROR,
  payload: number,
}
