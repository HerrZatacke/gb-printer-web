import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  if (state.progress.gif) {
    return ({
      progress: state.progress.gif,
      message: 'Creating GIF animation...',
    });
  }

  if (state.progress.plugin) {
    return ({
      progress: state.progress.plugin,
      message: 'Executing plugin...',
    });
  }

  if (state.progress.printer) {
    return ({
      progress: state.progress.printer,
      message: 'Fetching images from printer...',
    });
  }

  return {};
};

const mapDispatchToProps = (dispatch) => ({
  confirm: (type) => {
    dispatch({
      type,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
