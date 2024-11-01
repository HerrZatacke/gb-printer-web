import { useDispatch, useSelector } from 'react-redux';
import type { ExportFrameMode } from 'gb-image-decoder';
import useSettingsStore from '../../../../stores/settingsStore';
import getFrameGroups from '../../../../../tools/getFrameGroups';
import { Actions } from '../../../../store/actions';
import type { State } from '../../../../store/State';
import type { FrameGroup } from '../../../../../../types/FrameGroup';
import type { PrinterSetParamsAction, PrinterSetUrlAction } from '../../../../../../types/actions/PrinterActions';
import type {
  ForceMagicCheckAction,
} from '../../../../../../types/actions/StorageActions';
import type {
  EnableDebugAction,
  HideDatesAction,
  ImportDeletedAction,
  ImportLastSeenAction,
  ImportPadAction,
  PreferredLocaleAction,
} from '../../../../../../types/actions/GlobalActions';
import type { HandleExportFrameAction, SavFrameTypesAction } from '../../../../../../types/actions/FrameActions';

interface UseGenericSettings {
  exportScaleFactors: number[],
  exportFileTypes: string[],
  pageSize: number,
  savFrameTypes: string,
  savFrameGroups: FrameGroup[],
  handleExportFrame: ExportFrameMode,
  importDeleted: boolean,
  forceMagicCheck: boolean,
  importLastSeen: boolean,
  importPad: boolean,
  hideDates: boolean,
  printerUrl: string,
  printerParams: string,
  preferredLocale: string,
  enableDebug: boolean,
  setExportScaleFactors: (factor: number, checked: boolean) => void
  setExportFileTypes: (fileType: string, checked: boolean) => void
  setPageSize: (pageSize: number) => void
  setSavFrameTypes: (savFrameTypes: string) => void
  setHandleExportFrame: (handleExportFrame: ExportFrameMode) => void
  setImportDeleted: (importDeleted: boolean) => void
  setForceMagicCheck: (forceMagicCheck: boolean) => void
  setImportLastSeen: (importLastSeen: boolean) => void
  setImportPad: (importPad: boolean) => void
  setHideDates: (hideDates: boolean) => void
  updatePrinterUrl: (printerUrl: string) => void
  updatePrinterParams: (printerParams: string) => void
  setPreferredLocale: (preferredLocale: string) => void
  setEnableDebug: (enableDebug: boolean) => void
}

export const useGenericSettings = (): UseGenericSettings => {
  const fromZState = useSettingsStore();

  const fromState = useSelector((state: State) => ({
    savFrameTypes: state.savFrameTypes,
    savFrameGroups: getFrameGroups(state.frames, state.frameGroupNames),
    handleExportFrame: state.handleExportFrame,
    importDeleted: state.importDeleted,
    forceMagicCheck: state.forceMagicCheck,
    importLastSeen: state.importLastSeen,
    importPad: state.importPad,
    hideDates: state.hideDates,
    printerUrl: state.printerUrl,
    printerParams: state.printerParams,
    preferredLocale: state.preferredLocale,
    enableDebug: state.enableDebug,
  }));

  const dispatch = useDispatch();

  return {
    ...fromState,
    ...fromZState,
    setSavFrameTypes(savFrameTypes: string) {
      dispatch<SavFrameTypesAction>({
        type: Actions.SET_SAV_FRAME_TYPES,
        payload: savFrameTypes,
      });
    },
    setHandleExportFrame(handleExportFrame: ExportFrameMode) {
      dispatch<HandleExportFrameAction>({
        type: Actions.SET_HANDLE_EXPORT_FRAME,
        payload: handleExportFrame,
      });
    },
    setImportDeleted(importDeleted: boolean) {
      dispatch<ImportDeletedAction>({
        type: Actions.SET_IMPORT_DELETED,
        payload: importDeleted,
      });
    },
    setForceMagicCheck(forceMagicCheck: boolean) {
      dispatch<ForceMagicCheckAction>({
        type: Actions.SET_FORCE_MAGIC_CHECK,
        payload: forceMagicCheck,
      });
    },
    setImportLastSeen(importLastSeen: boolean) {
      dispatch<ImportLastSeenAction>({
        type: Actions.SET_IMPORT_LAST_SEEN,
        payload: importLastSeen,
      });
    },
    setImportPad(importPad: boolean) {
      dispatch<ImportPadAction>({
        type: Actions.SET_IMPORT_PAD,
        payload: importPad,
      });
    },
    setHideDates(hideDates: boolean) {
      dispatch<HideDatesAction>({
        type: Actions.SET_HIDE_DATES,
        payload: hideDates,
      });
    },
    updatePrinterUrl(printerUrl: string) {
      dispatch<PrinterSetUrlAction>({
        type: Actions.SET_PRINTER_URL,
        payload: printerUrl,
      });
    },
    updatePrinterParams(printerParams: string) {
      dispatch<PrinterSetParamsAction>({
        type: Actions.SET_PRINTER_PARAMS,
        payload: printerParams,
      });
    },
    setPreferredLocale(preferredLocale: string) {
      dispatch<PreferredLocaleAction>({
        type: Actions.SET_PREFERRED_LOCALE,
        payload: preferredLocale,
      });
    },
    setEnableDebug(enableDebug: boolean) {
      dispatch<EnableDebugAction>({
        type: Actions.SET_DEBUG,
        payload: enableDebug,
      });
    },
  };
};


