import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  messages: state.gitLog,
});

const mapDispatchToProps = (dispatch) => ({
  confirm: () => {
    dispatch({
      type: 'GITSTORAGE_LOG_CLEAR',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
