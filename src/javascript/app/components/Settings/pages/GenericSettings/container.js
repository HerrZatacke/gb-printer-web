import { connect } from 'react-redux';
import getFrameGroups from '../../../../../tools/getFrameGroups';
import { Actions } from '../../../../store/actions';

const mapStateToProps = (state) => ({
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
});

const mapDispatchToProps = (dispatch) => ({
  setSavFrameTypes(savFrameTypes) {
    dispatch({
      type: Actions.SET_SAV_FRAME_TYPES,
      payload: savFrameTypes,
    });
  },
  setHandleExportFrame(handleExportFrame) {
    dispatch({
      type: Actions.SET_HANDLE_EXPORT_FRAME,
      payload: handleExportFrame,
    });
  },
  setImportLastSeen(importLastSeen) {
    dispatch({
      type: Actions.SET_IMPORT_LAST_SEEN,
      payload: importLastSeen,
    });
  },
  setImportDeleted(importDeleted) {
    dispatch({
      type: Actions.SET_IMPORT_DELETED,
      payload: importDeleted,
    });
  },
  setForceMagicCheck(forceMagicCheck) {
    dispatch({
      type: Actions.SET_FORCE_MAGIC_CHECK,
      payload: forceMagicCheck,
    });
  },
  setImportPad(importPad) {
    dispatch({
      type: Actions.SET_IMPORT_PAD,
      payload: importPad,
    });
  },
  setHideDates(hideDates) {
    dispatch({
      type: Actions.SET_HIDE_DATES,
      payload: hideDates,
    });
  },
  setEnableDebug(enableDebug) {
    dispatch({
      type: Actions.SET_DEBUG,
      payload: enableDebug,
    });
  },
  setPreferredLocale(preferredLocale) {
    dispatch({
      type: Actions.SET_PREFERRED_LOCALE,
      payload: preferredLocale,
    });
  },
  setPageSize(pageSize) {
    dispatch({
      type: Actions.SET_PAGESIZE,
      payload: pageSize,
    });
  },
  changeExportScaleFactors(factor, checked) {
    dispatch({
      type: Actions.UPDATE_EXPORT_SCALE_FACTORS,
      payload: {
        factor,
        checked,
      },
    });
  },
  changeExportFileTypes(fileType, checked) {
    dispatch({
      type: Actions.UPDATE_EXPORT_FILE_TYPES,
      payload: {
        fileType,
        checked,
      },
    });
  },
  updatePrinterUrl(printerUrl) {
    dispatch({
      type: Actions.SET_PRINTER_URL,
      payload: printerUrl,
    });
  },
  updatePrinterParams(printerParams) {
    dispatch({
      type: Actions.SET_PRINTER_PARAMS,
      payload: printerParams,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
