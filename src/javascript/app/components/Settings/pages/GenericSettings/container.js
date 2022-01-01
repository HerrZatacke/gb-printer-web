import { connect } from 'react-redux';
import getFrameGroups from '../../../../../tools/getFrameGroups';
import {
  SET_HANDLE_EXPORT_FRAME,
  SET_HIDE_DATES,
  SET_IMPORT_LAST_SEEN,
  SET_PAGESIZE,
  SET_PREFERRED_LOCALE,
  SET_PRINTER_PARAMS,
  SET_PRINTER_URL,
  SET_SAV_FRAME_TYPES,
  UPDATE_EXPORT_FILE_TYPES,
  UPDATE_EXPORT_SCALE_FACTORS,
} from '../../../../store/actions';

const mapStateToProps = (state) => ({
  exportScaleFactors: state.exportScaleFactors,
  exportFileTypes: state.exportFileTypes,
  pageSize: state.pageSize,
  savFrameTypes: state.savFrameTypes,
  savFrameGroups: getFrameGroups(state.frames),
  handleExportFrame: state.handleExportFrame,
  importLastSeen: state.importLastSeen,
  hideDates: state.hideDates,
  printerUrl: state.printerUrl,
  printerParams: state.printerParams,
  preferredLocale: state.preferredLocale,
});

const mapDispatchToProps = (dispatch) => ({
  setSavFrameTypes(savFrameTypes) {
    dispatch({
      type: SET_SAV_FRAME_TYPES,
      payload: savFrameTypes,
    });
  },
  setHandleExportFrame(handleExportFrame) {
    dispatch({
      type: SET_HANDLE_EXPORT_FRAME,
      payload: handleExportFrame,
    });
  },
  setImportLastSeen(importLastSeen) {
    dispatch({
      type: SET_IMPORT_LAST_SEEN,
      payload: importLastSeen,
    });
  },
  setHideDates(hideDates) {
    dispatch({
      type: SET_HIDE_DATES,
      payload: hideDates,
    });
  },
  setPreferredLocale(preferredLocale) {
    dispatch({
      type: SET_PREFERRED_LOCALE,
      payload: preferredLocale,
    });
  },
  setPageSize(pageSize) {
    dispatch({
      type: SET_PAGESIZE,
      payload: pageSize,
    });
  },
  changeExportScaleFactors(factor, checked) {
    dispatch({
      type: UPDATE_EXPORT_SCALE_FACTORS,
      payload: {
        factor,
        checked,
      },
    });
  },
  changeExportFileTypes(fileType, checked) {
    dispatch({
      type: UPDATE_EXPORT_FILE_TYPES,
      payload: {
        fileType,
        checked,
      },
    });
  },
  updatePrinterUrl(printerUrl) {
    dispatch({
      type: SET_PRINTER_URL,
      payload: printerUrl,
    });
  },
  updatePrinterParams(printerParams) {
    dispatch({
      type: SET_PRINTER_PARAMS,
      payload: printerParams,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
