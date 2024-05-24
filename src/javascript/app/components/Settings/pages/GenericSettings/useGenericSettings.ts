import { useDispatch, useSelector } from 'react-redux';
import { ExportFrameMode } from 'gb-image-decoder';
import getFrameGroups from '../../../../../tools/getFrameGroups';
import { Actions } from '../../../../store/actions';
import { State } from '../../../../store/State';
import { FrameGroup } from '../../../../../../types/FrameGroup';
import { ExportScaleFactorsAction } from '../../../../store/reducers/exportScaleFactorsReducer';
import { ExportFileTypesAction } from '../../../../store/reducers/exportFileTypesReducer';
import { PageSizeAction } from '../../../../store/reducers/pageSizeReducer';
import { SavFrameTypesAction } from '../../../../store/reducers/savFrameTypesReducer';
import { HandleExportFrameAction } from '../../../../store/reducers/handleExportFrameReducer';
import { ImportDeletedAction } from '../../../../store/reducers/importDeletedReducer';
import { ForceMagicCheckAction } from '../../../../store/reducers/forceMagicCheckReducer';
import { ImportLastSeenAction } from '../../../../store/reducers/importLastSeenReducer';
import { ImportPadAction } from '../../../../store/reducers/importPadReducer';
import { HideDatesAction } from '../../../../store/reducers/hideDatesReducer';
import { PrinterSetParamsAction, PrinterSetUrlAction } from '../../../../../../types/actions/PrinterActions';
import { PreferredLocaleAction } from '../../../../store/reducers/preferredLocaleReducer';
import { EnableDebugAction } from '../../../../store/reducers/enableDebugReducer';

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
  changeExportScaleFactors: (factor: number, checked: boolean) => void
  changeExportFileTypes: (fileType: string, checked: boolean) => void
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
  const fromState = useSelector((state: State) => ({
    exportScaleFactors: state.exportScaleFactors,
    exportFileTypes: state.exportFileTypes,
    pageSize: state.pageSize,
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
    changeExportScaleFactors(factor: number, checked: boolean) {
      dispatch({
        type: Actions.UPDATE_EXPORT_SCALE_FACTORS,
        payload: {
          factor,
          checked,
        },
      } as ExportScaleFactorsAction);
    },
    changeExportFileTypes(fileType: string, checked: boolean) {
      dispatch({
        type: Actions.UPDATE_EXPORT_FILE_TYPES,
        payload: {
          fileType,
          checked,
        },
      } as ExportFileTypesAction);
    },
    setPageSize(pageSize: number) {
      dispatch({
        type: Actions.SET_PAGESIZE,
        payload: pageSize,
      } as PageSizeAction);
    },
    setSavFrameTypes(savFrameTypes: string) {
      dispatch({
        type: Actions.SET_SAV_FRAME_TYPES,
        payload: savFrameTypes,
      } as SavFrameTypesAction);
    },
    setHandleExportFrame(handleExportFrame: ExportFrameMode) {
      dispatch({
        type: Actions.SET_HANDLE_EXPORT_FRAME,
        payload: handleExportFrame,
      } as HandleExportFrameAction);
    },
    setImportDeleted(importDeleted: boolean) {
      dispatch({
        type: Actions.SET_IMPORT_DELETED,
        payload: importDeleted,
      } as ImportDeletedAction);
    },
    setForceMagicCheck(forceMagicCheck: boolean) {
      dispatch({
        type: Actions.SET_FORCE_MAGIC_CHECK,
        payload: forceMagicCheck,
      } as ForceMagicCheckAction);
    },
    setImportLastSeen(importLastSeen: boolean) {
      dispatch({
        type: Actions.SET_IMPORT_LAST_SEEN,
        payload: importLastSeen,
      } as ImportLastSeenAction);
    },
    setImportPad(importPad: boolean) {
      dispatch({
        type: Actions.SET_IMPORT_PAD,
        payload: importPad,
      } as ImportPadAction);
    },
    setHideDates(hideDates: boolean) {
      dispatch({
        type: Actions.SET_HIDE_DATES,
        payload: hideDates,
      } as HideDatesAction);
    },
    updatePrinterUrl(printerUrl: string) {
      dispatch({
        type: Actions.SET_PRINTER_URL,
        payload: printerUrl,
      } as PrinterSetUrlAction);
    },
    updatePrinterParams(printerParams: string) {
      dispatch({
        type: Actions.SET_PRINTER_PARAMS,
        payload: printerParams,
      } as PrinterSetParamsAction);
    },
    setPreferredLocale(preferredLocale: string) {
      dispatch({
        type: Actions.SET_PREFERRED_LOCALE,
        payload: preferredLocale,
      } as PreferredLocaleAction);
    },
    setEnableDebug(enableDebug: boolean) {
      dispatch({
        type: Actions.SET_DEBUG,
        payload: enableDebug,
      } as EnableDebugAction);
    },
  };
};


