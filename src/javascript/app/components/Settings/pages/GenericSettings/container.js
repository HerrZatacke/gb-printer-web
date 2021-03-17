import { connect } from 'react-redux';
import getFrameGroups from '../../../../../tools/getFrameGroups';

const mapStateToProps = (state) => ({
  exportScaleFactors: state.exportScaleFactors,
  exportFileTypes: state.exportFileTypes,
  pageSize: state.pageSize,
  savFrameTypes: state.savFrameTypes,
  savFrameGroups: getFrameGroups(state.frames),
  exportCropFrame: state.exportCropFrame,
  hideDates: state.hideDates,
  printerUrl: state.printerUrl,
});

const mapDispatchToProps = (dispatch) => ({
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
  updatePrinterUrl(printerUrl) {
    dispatch({
      type: 'SET_PRINTER_URL',
      payload: printerUrl,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
