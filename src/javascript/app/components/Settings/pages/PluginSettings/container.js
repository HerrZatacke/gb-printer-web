import { connect } from 'react-redux';
import { Actions } from '../../../../store/actions';

const mapStateToProps = (state) => ({
  plugins: state.plugins,
});

const mapDispatchToProps = (dispatch) => ({
  pluginAdd: (url) => {
    dispatch({
      type: Actions.PLUGIN_ADD,
      payload: url,
    });
  },
  pluginRemove: (url) => {
    dispatch({
      type: Actions.PLUGIN_REMOVE,
      payload: url,
    });
  },
  pluginUpdateConfig: (url, key, value) => {
    dispatch({
      type: Actions.PLUGIN_UPDATE_CONFIG,
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
