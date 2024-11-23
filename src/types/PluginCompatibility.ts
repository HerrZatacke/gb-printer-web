import type { Dialog } from './Dialog';
import type { Image } from './Image';

export enum CompatibilityActionType {
  CONFIRM_ASK = 'CONFIRM_ASK',
  CONFIRM_ANSWERED = 'CONFIRM_ANSWERED',
  ADD_IMAGES = 'ADD_IMAGES',
  IMPORT_FILES = 'IMPORT_FILES',
}

interface CompatibilityActionBase {
  type: CompatibilityActionType,
  payload?: unknown,
}

export interface CompatibilityActionConfirmAsk extends CompatibilityActionBase {
  type: CompatibilityActionType.CONFIRM_ASK,
  payload: Dialog
}

export interface CompatibilityActionConfirmAnswered extends CompatibilityActionBase {
  type: CompatibilityActionType.CONFIRM_ANSWERED,
  payload: undefined
}

export interface CompatibilityActionAddImages extends CompatibilityActionBase {
  type: CompatibilityActionType.ADD_IMAGES,
  payload: Image[],
}

export interface CompatibilityActionImportFiles extends CompatibilityActionBase {
  type: CompatibilityActionType.IMPORT_FILES,
  payload: { files: File[] },
}

export type CompatibilityAction =
  CompatibilityActionConfirmAsk |
  CompatibilityActionConfirmAnswered |
  CompatibilityActionAddImages |
  CompatibilityActionImportFiles;

export interface PluginCompatibilityWrapper {
  dispatch: (action: CompatibilityAction) => void,
}
