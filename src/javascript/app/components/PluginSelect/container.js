import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  plugins: state.plugins,
});

const mapDispatchToProps = (dispatch, { hash }) => ({
  toPlugins: () => {
    dispatch({
      type: 'PLUGIN_IMAGE',
      payload: hash,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
