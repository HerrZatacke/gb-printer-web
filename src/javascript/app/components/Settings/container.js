import { connect } from 'react-redux';
import getFrameGroups from '../../../tools/getFrameGroups';

const mapStateToProps = (state) => ({
  socketUrl: state.socketUrl,
  printerUrl: state.printerUrl,
  exportScaleFactors: state.exportScaleFactors,
  exportFileTypes: state.exportFileTypes,
  pageSize: state.pageSize,
  gitStorage: state.gitStorage,
  savFrameTypes: state.savFrameTypes,
  savFrameGroups: getFrameGroups(state.frames),
  exportCropFrame: state.exportCropFrame,
  hideDates: state.hideDates,
});

const mapDispatchToProps = (dispatch) => ({
  updateSocketUrl(socketUrl) {
    dispatch({
      type: 'SET_SOCKET_URL',
      payload: socketUrl,
    });
  },
  updatePrinterUrl(printerUrl) {
    dispatch({
      type: 'SET_PRINTER_URL',
      payload: printerUrl,
    });
  },
  setSavFrameTypes(savFrameTypes) {
    dispatch({
      type: 'SET_SAV_FRAME_TYPES',
      payload: savFrameTypes,
    });
  },
  setExportCropFrame(exportCropFrame) {
    dispatch({
      type: 'SET_EXPORT_CROP_FRAME',
      payload: exportCropFrame,
    });
  },
  setHideDates(hideDates) {
    dispatch({
      type: 'SET_HIDE_DATES',
      payload: hideDates,
    });
  },
  setPageSize(pageSize) {
    dispatch({
      type: 'SET_PAGESIZE',
      payload: pageSize,
    });
  },
  setGitStorage(gitStorage) {
    dispatch({
      type: 'SET_GIT_STORAGE',
      payload: gitStorage,
    });
  },
  exportJson(what) {
    dispatch({
      type: 'JSON_EXPORT',
      payload: what,
    });
  },
  changeExportScaleFactors(factor, checked) {
    dispatch({
      type: 'UPDATE_EXPORT_SCALE_FACTORS',
      payload: {
        factor,
        checked,
      },
    });
  },
  changeExportFileTypes(fileType, checked) {
    dispatch({
      type: 'UPDATE_EXPORT_FILE_TYPES',
      payload: {
        fileType,
        checked,
      },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
