import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  socketUrl: state.socketUrl,
  exportScaleFactors: state.exportScaleFactors,
  pageSize: state.pageSize,
});

const mapDispatchToProps = (dispatch) => ({
  updateSocketUrl(socketUrl) {
    dispatch({
      type: 'SET_SOCKET_URL',
      payload: socketUrl,
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
});

export default connect(mapStateToProps, mapDispatchToProps);
