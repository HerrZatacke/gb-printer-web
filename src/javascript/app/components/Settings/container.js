import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  socketUrl: state.socketUrl,
  printerUrl: state.printerUrl,
  exportScaleFactors: state.exportScaleFactors,
  exportFileTypes: state.exportFileTypes,
  pageSize: state.pageSize,
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
  setPageSize(pageSize) {
    dispatch({
      type: 'SET_PAGESIZE',
      payload: pageSize,
    });
  },
  exportSettings(what) {
    dispatch({
      type: 'SETTINGS_EXPORT',
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
