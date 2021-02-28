import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  plugins: state.plugins,
});

const mapDispatchToProps = (dispatch) => ({
  pluginAdd: (url) => {
    dispatch({
      type: 'PLUGIN_ADD',
      payload: url,
    });
  },
  pluginRemove: (url) => {
    dispatch({
      type: 'PLUGIN_REMOVE',
      payload: url,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
