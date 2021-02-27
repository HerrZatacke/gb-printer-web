import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  plugins: state.plugins,
});

const mapDispatchToProps = (dispatch, { hash }) => ({
  toPlugins: (url) => {
    dispatch({
      type: 'PLUGIN_IMAGE',
      payload: {
        url,
        hash,
      },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
