import { CompatibilityActionType } from '@/consts/plugins';
import { type Dialog } from './Dialog';
import { type Image } from './Image';

interface CompatibilityActionBase {
  type: CompatibilityActionType;
  payload?: unknown;
}

export interface CompatibilityActionConfirmAsk extends CompatibilityActionBase {
  type: typeof CompatibilityActionType.CONFIRM_ASK;
  payload: Dialog;
}

export interface CompatibilityActionConfirmAnswered extends CompatibilityActionBase {
  type: typeof CompatibilityActionType.CONFIRM_ANSWERED;
  payload: undefined;
}

export interface CompatibilityActionAddImages extends CompatibilityActionBase {
  type: typeof CompatibilityActionType.ADD_IMAGES;
  payload: Image[];
}

export interface CompatibilityActionImportFiles extends CompatibilityActionBase {
  type: typeof CompatibilityActionType.IMPORT_FILES;
  payload: { files: File[] };
}

export type CompatibilityAction =
  CompatibilityActionConfirmAsk |
  CompatibilityActionConfirmAnswered |
  CompatibilityActionAddImages |
  CompatibilityActionImportFiles;

export interface PluginCompatibilityWrapper {
  dispatch: (action: CompatibilityAction) => void;
}
