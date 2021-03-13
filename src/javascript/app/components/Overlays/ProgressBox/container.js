import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  if (state.progress.gif) {
    return ({
      progress: state.progress.gif,
      message: 'Creating GIF animation...',
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
