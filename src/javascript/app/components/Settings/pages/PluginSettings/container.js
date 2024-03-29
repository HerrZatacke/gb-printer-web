import { connect } from 'react-redux';
import { PLUGIN_ADD, PLUGIN_REMOVE, PLUGIN_UPDATE_CONFIG } from '../../../../store/actions';

const mapStateToProps = (state) => ({
  plugins: state.plugins,
});

const mapDispatchToProps = (dispatch) => ({
  pluginAdd: (url) => {
    dispatch({
      type: PLUGIN_ADD,
      payload: url,
    });
  },
  pluginRemove: (url) => {
    dispatch({
      type: PLUGIN_REMOVE,
      payload: url,
    });
  },
  pluginUpdateConfig: (url, key, value) => {
    dispatch({
      type: PLUGIN_UPDATE_CONFIG,
      payload: {
        url,
        config: {
          [key]: value,
        },
      },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
