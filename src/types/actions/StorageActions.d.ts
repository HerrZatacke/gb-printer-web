import type { Actions } from '../../javascript/app/store/actions';
import type { ExportTypes } from '../../javascript/consts/exportTypes';
import type { RepoContents } from '../Export';
import type { JSONExportState } from '../../javascript/app/store/State';

export interface GitSettingsImportAction {
  type: Actions.GIT_SETTINGS_IMPORT,
  payload: RepoContents,
}

export interface ImportJSONAction {
  type: Actions.JSON_IMPORT,
  payload: Partial<JSONExportState>,
}

export interface ExportJSONAction {
  type: Actions.JSON_EXPORT,
  payload: ExportTypes,
  selectedFrameGroup?: string,
}
