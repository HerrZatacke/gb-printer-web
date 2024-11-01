import { useDispatch, useSelector } from 'react-redux';
import type { ExportFrameMode } from 'gb-image-decoder';
import useSettingsStore from '../../../../stores/settingsStore';
import getFrameGroups from '../../../../../tools/getFrameGroups';
import { Actions } from '../../../../store/actions';
import type { State } from '../../../../store/State';
import type { FrameGroup } from '../../../../../../types/FrameGroup';
import type { PrinterSetParamsAction, PrinterSetUrlAction } from '../../../../../../types/actions/PrinterActions';
import type {
  PreferredLocaleAction,
} from '../../../../../../types/actions/GlobalActions';

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
    savFrameGroups: getFrameGroups(state.frames, state.frameGroupNames),
    printerUrl: state.printerUrl,
    printerParams: state.printerParams,
    preferredLocale: state.preferredLocale,
  }));

  const dispatch = useDispatch();

  return {
    ...fromState,
    ...fromZState,
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
  };
};


